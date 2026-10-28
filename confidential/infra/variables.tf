variable "project_id" {
  description = "Google Cloud project id"
  type        = string
}

variable "region" {
  description = "Region for KMS and Artifact Registry (asia-northeast1 = Tokyo)"
  type        = string
  default     = "asia-northeast1"
}

variable "zone" {
  description = "Zone for the confidential VM"
  type        = string
  default     = "asia-northeast1-b"
}

variable "machine_type" {
  description = "AMD SEV capable machine type"
  type        = string
  default     = "n2d-standard-2"
}

variable "image_digest" {
  description = "sha256:... digest of the pushed workload image. Leave empty on the first apply; the VM is created once it is set."
  type        = string
  default     = ""
}

variable "client_members" {
  description = "IAM members allowed to wrap data keys, e.g. [\"serviceAccount:app@PROJECT.iam.gserviceaccount.com\"]"
  type        = list(string)
  default     = []
}

variable "allowed_cidrs" {
  description = "Source ranges allowed to reach the workload API on port 8080"
  type        = list(string)
}
