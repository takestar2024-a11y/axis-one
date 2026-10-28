terraform {
  required_version = ">= 1.5"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 5.30"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

data "google_project" "this" {}

resource "google_project_service" "apis" {
  for_each = toset([
    "artifactregistry.googleapis.com",
    "cloudkms.googleapis.com",
    "compute.googleapis.com",
    "confidentialcomputing.googleapis.com",
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "sts.googleapis.com",
  ])
  service            = each.value
  disable_on_destroy = false
}

# --- Container registry ------------------------------------------------------

resource "google_artifact_registry_repository" "workload" {
  location      = var.region
  repository_id = "securify"
  format        = "DOCKER"
  depends_on    = [google_project_service.apis]
}

locals {
  image_repo = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.workload.repository_id}/workload"
}

# --- Key used to wrap per-request data keys ----------------------------------

resource "google_kms_key_ring" "this" {
  name       = "securify-cc"
  location   = var.region
  depends_on = [google_project_service.apis]
}

resource "google_kms_crypto_key" "dek_wrap" {
  name            = "dek-wrap"
  key_ring        = google_kms_key_ring.this.id
  purpose         = "ENCRYPT_DECRYPT"
  rotation_period = "7776000s" # 90 days
}

# Clients may only wrap keys. They can never unwrap.
resource "google_kms_crypto_key_iam_member" "client_encrypt" {
  for_each      = toset(var.client_members)
  crypto_key_id = google_kms_crypto_key.dek_wrap.id
  role          = "roles/cloudkms.cryptoKeyEncrypter"
  member        = each.value
}

# --- Workload identity bound to remote attestation ---------------------------

resource "google_service_account" "workload" {
  account_id   = "securify-cc-workload"
  display_name = "securify confidential workload VM"
}

resource "google_project_iam_member" "workload_roles" {
  for_each = toset([
    "roles/confidentialcomputing.workloadUser",
    "roles/logging.logWriter",
  ])
  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.workload.email}"
}

resource "google_artifact_registry_repository_iam_member" "workload_pull" {
  location   = google_artifact_registry_repository.workload.location
  repository = google_artifact_registry_repository.workload.name
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:${google_service_account.workload.email}"
}

resource "google_iam_workload_identity_pool" "cc" {
  workload_identity_pool_id = "securify-cc-pool"
  display_name              = "securify confidential space"
  depends_on                = [google_project_service.apis]
}

# Google's attestation verifier only issues a token whose claims satisfy this
# condition when the VM is a production (non-debug) Confidential Space image
# running exactly our container digest under our service account.
resource "google_iam_workload_identity_pool_provider" "attestation" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.cc.workload_identity_pool_id
  workload_identity_pool_provider_id = "attestation-verifier"
  display_name                       = "attestation verifier"

  attribute_mapping = {
    "google.subject"         = "assertion.sub"
    "attribute.image_digest" = "assertion.submods.container.image_digest"
  }

  attribute_condition = join(" && ", [
    "assertion.swname == 'CONFIDENTIAL_SPACE'",
    "'STABLE' in assertion.submods.confidential_space.support_attributes",
    "assertion.dbgstat == 'disabled-since-boot'",
    "assertion.submods.container.image_digest == '${var.image_digest}'",
    "'${google_service_account.workload.email}' in assertion.google_service_accounts",
  ])

  oidc {
    issuer_uri        = "https://confidentialcomputing.googleapis.com/"
    allowed_audiences = ["https://sts.googleapis.com"]
  }
}

# The only principal that can unwrap data keys: attested workloads running
# the pinned image digest.
resource "google_kms_crypto_key_iam_member" "attested_decrypt" {
  count         = var.image_digest == "" ? 0 : 1
  crypto_key_id = google_kms_crypto_key.dek_wrap.id
  role          = "roles/cloudkms.cryptoKeyDecrypter"
  member        = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.cc.name}/attribute.image_digest/${var.image_digest}"
}

# --- Confidential VM -------------------------------------------------------------

data "google_compute_image" "confidential_space" {
  project = "confidential-space-images"
  family  = "confidential-space"
}

resource "google_compute_instance" "workload" {
  count        = var.image_digest == "" ? 0 : 1
  name         = "securify-cc-workload"
  zone         = var.zone
  machine_type = var.machine_type
  tags         = ["securify-cc"]

  confidential_instance_config {
    confidential_instance_type = "SEV"
  }

  shielded_instance_config {
    enable_secure_boot = true
  }

  scheduling {
    on_host_maintenance = "TERMINATE"
  }

  boot_disk {
    initialize_params {
      image = data.google_compute_image.confidential_space.self_link
    }
  }

  network_interface {
    network = "default"
    access_config {}
  }

  service_account {
    email  = google_service_account.workload.email
    scopes = ["cloud-platform"]
  }

  metadata = {
    "tee-image-reference"  = "${local.image_repo}@${var.image_digest}"
    "tee-restart-policy"   = "Always"
    "tee-env-KMS_KEY_NAME" = google_kms_crypto_key.dek_wrap.id
    "tee-env-WIP_PROVIDER" = google_iam_workload_identity_pool_provider.attestation.name
  }

  depends_on = [
    google_kms_crypto_key_iam_member.attested_decrypt,
    google_project_iam_member.workload_roles,
    google_artifact_registry_repository_iam_member.workload_pull,
  ]
}

resource "google_compute_firewall" "workload" {
  name          = "securify-cc-allow-api"
  network       = "default"
  source_ranges = var.allowed_cidrs
  target_tags   = ["securify-cc"]

  allow {
    protocol = "tcp"
    ports    = ["8080"]
  }
}
