// Entry point inside the Confidential Space container.
//
// Required env (set through `tee-env-*` VM metadata, allowed by the image's
// launch policy):
//   KMS_KEY_NAME  projects/P/locations/L/keyRings/R/cryptoKeys/K
//   WIP_PROVIDER  projects/NUM/locations/global/workloadIdentityPools/POOL/providers/PROV
// Local development:
//   SECURIFY_ALLOW_LOCAL_KEYS=1 LOCAL_KEK=<base64 32 bytes>
import { GcpKms, LocalKeys, writeAttestationCredentials, type KeyUnwrapper } from "./keys.js";
import { createScanServer } from "./server.js";

function keysFromEnv(): KeyUnwrapper {
  if (process.env.SECURIFY_ALLOW_LOCAL_KEYS === "1") {
    const kek = process.env.LOCAL_KEK;
    if (!kek) throw new Error("LOCAL_KEK is required in local mode");
    console.warn("WARNING: local key mode. No TEE or attestation guarantees.");
    return LocalKeys.fromBase64(kek);
  }

  const keyName = process.env.KMS_KEY_NAME;
  const provider = process.env.WIP_PROVIDER;
  if (!keyName || !provider) throw new Error("KMS_KEY_NAME and WIP_PROVIDER are required");
  const credPath = "/tmp/attestation-credentials.json";
  writeAttestationCredentials(provider, credPath);
  return new GcpKms(keyName, credPath);
}

const port = Number(process.env.PORT ?? 8080);
createScanServer(keysFromEnv()).listen(port, () => {
  console.log(`securify confidential workload listening on :${port}`);
});
