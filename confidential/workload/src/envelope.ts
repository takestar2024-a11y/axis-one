// AES-256-GCM envelope encryption shared by the workload and the client.
// The data key (DEK) never travels in the clear: it is wrapped by Cloud KMS,
// and only an attested Confidential Space workload is allowed to unwrap it.
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

export const DEK_BYTES = 32;
const IV_BYTES = 12;
const TAG_BYTES = 16;

export interface Sealed {
  iv: string; // base64
  ciphertext: string; // base64
  tag: string; // base64
}

export function newDataKey(): Buffer {
  return randomBytes(DEK_BYTES);
}

export function seal(key: Buffer, plaintext: Buffer, aad: string): Sealed {
  assertKey(key);
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(Buffer.from(aad, "utf8"));
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  return {
    iv: iv.toString("base64"),
    ciphertext: ciphertext.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
  };
}

export function open(key: Buffer, sealed: Sealed, aad: string): Buffer {
  assertKey(key);
  const iv = Buffer.from(sealed.iv, "base64");
  const tag = Buffer.from(sealed.tag, "base64");
  if (iv.length !== IV_BYTES || tag.length !== TAG_BYTES) {
    throw new Error("malformed envelope");
  }
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAAD(Buffer.from(aad, "utf8"));
  decipher.setAuthTag(tag);
  return Buffer.concat([
    decipher.update(Buffer.from(sealed.ciphertext, "base64")),
    decipher.final(),
  ]);
}

// Binding the request id and direction into the AAD stops a captured
// response from being replayed as a request (or vice versa).
export function requestAad(requestId: string): string {
  return `securify/scan/v1:request:${requestId}`;
}

export function responseAad(requestId: string): string {
  return `securify/scan/v1:response:${requestId}`;
}

function assertKey(key: Buffer): void {
  if (key.length !== DEK_BYTES) throw new Error("data key must be 32 bytes");
}
