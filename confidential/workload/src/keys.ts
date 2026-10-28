// Wrapping and unwrapping of data keys.
//
// In production the DEK is wrapped with a Cloud KMS key. Clients hold only
// the "encrypter" role; the "decrypter" role is granted solely to the
// Confidential Space workload identity, which Google issues only after
// remote attestation proves the VM runs our exact container image inside an
// AMD SEV TEE. So the plaintext DEK can exist only in TEE memory.
import { KeyManagementServiceClient } from "@google-cloud/kms";
import { writeFileSync } from "node:fs";
import { DEK_BYTES, newDataKey, open, seal, type Sealed } from "./envelope.js";

export interface KeyWrapper {
  wrap(dek: Buffer): Promise<Buffer>;
}

export interface KeyUnwrapper {
  unwrap(wrapped: Buffer): Promise<Buffer>;
}

// Confidential Space writes the attestation token here. Its audience is
// https://sts.googleapis.com, which is what Workload Identity Federation expects.
export const ATTESTATION_TOKEN_PATH = "/run/container_launcher/attestation_verifier_claims_token";

// Builds an external_account credential that exchanges the attestation token
// for a federated Google token. `provider` is the full resource name of the
// workload identity pool provider (projects/NUM/locations/global/...).
export function writeAttestationCredentials(provider: string, path: string): void {
  const config = {
    type: "external_account",
    audience: `//iam.googleapis.com/${provider}`,
    subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
    token_url: "https://sts.googleapis.com/v1/token",
    credential_source: { file: ATTESTATION_TOKEN_PATH },
  };
  writeFileSync(path, JSON.stringify(config), { mode: 0o600 });
}

export class GcpKms implements KeyWrapper, KeyUnwrapper {
  private client: KeyManagementServiceClient;

  constructor(private keyName: string, keyFilename?: string) {
    this.client = new KeyManagementServiceClient(keyFilename ? { keyFilename } : {});
  }

  async wrap(dek: Buffer): Promise<Buffer> {
    const [res] = await this.client.encrypt({ name: this.keyName, plaintext: dek });
    return Buffer.from(res.ciphertext as Uint8Array);
  }

  async unwrap(wrapped: Buffer): Promise<Buffer> {
    const [res] = await this.client.decrypt({ name: this.keyName, ciphertext: wrapped });
    const dek = Buffer.from(res.plaintext as Uint8Array);
    if (dek.length !== DEK_BYTES) throw new Error("unexpected data key length");
    return dek;
  }
}

// Development-only stand-in for KMS. It provides no TEE guarantees and is
// refused by main.ts unless SECURIFY_ALLOW_LOCAL_KEYS=1 is set explicitly.
export class LocalKeys implements KeyWrapper, KeyUnwrapper {
  constructor(private kek: Buffer) {}

  static fromBase64(b64: string): LocalKeys {
    return new LocalKeys(Buffer.from(b64, "base64"));
  }

  static generate(): LocalKeys {
    return new LocalKeys(newDataKey());
  }

  get kekBase64(): string {
    return this.kek.toString("base64");
  }

  async wrap(dek: Buffer): Promise<Buffer> {
    return Buffer.from(JSON.stringify(seal(this.kek, dek, "securify/local-kek")));
  }

  async unwrap(wrapped: Buffer): Promise<Buffer> {
    const sealed = JSON.parse(wrapped.toString("utf8")) as Sealed;
    const dek = open(this.kek, sealed, "securify/local-kek");
    if (dek.length !== DEK_BYTES) throw new Error("unexpected data key length");
    return dek;
  }
}
