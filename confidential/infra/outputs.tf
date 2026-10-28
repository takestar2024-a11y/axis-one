output "image_repo" {
  value = local.image_repo
}

output "kms_key_name" {
  value = google_kms_crypto_key.dek_wrap.id
}

output "wip_provider" {
  value = google_iam_workload_identity_pool_provider.attestation.name
}

output "workload_url" {
  value = length(google_compute_instance.workload) == 0 ? null : "http://${google_compute_instance.workload[0].network_interface[0].access_config[0].nat_ip}:8080"
}
