// Client CLI: encrypts a file locally, sends it to the workload and decrypts
// the report. The plaintext and the DEK never leave this machine unwrapped.
//
//   node dist/src/client.js --url http://HOST:8080 --file input.txt --kms-key projects/.../cryptoKeys/K
//   node dist/src/client.js --url http://localhost:8080 --file input.txt --local-kek <base64>
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { newDataKey, open, requestAad, responseAad, seal, type Sealed } from "./envelope.js";
import { GcpKms, LocalKeys, type KeyWrapper } from "./keys.js";

export async function scanRemote(url: string, text: string, keys: KeyWrapper): Promise<unknown> {
  const requestId = randomUUID();
  const dek = newDataKey();
  try {
    const body = {
      requestId,
      wrappedKey: (await keys.wrap(dek)).toString("base64"),
      payload: seal(dek, Buffer.from(text, "utf8"), requestAad(requestId)),
    };
    const res = await fetch(new URL("/v1/scan", url), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = (await res.json()) as { requestId?: string; payload?: Sealed; error?: string };
    if (!res.ok || !json.payload) throw new Error(`scan failed (${res.status}): ${json.error ?? "unknown"}`);
    if (json.requestId !== requestId) throw new Error("response does not match request");
    return JSON.parse(open(dek, json.payload, responseAad(requestId)).toString("utf8"));
  } finally {
    dek.fill(0);
  }
}

async function main() {
  const { values } = parseArgs({
    options: {
      url: { type: "string" },
      file: { type: "string" },
      "kms-key": { type: "string" },
      "local-kek": { type: "string" },
    },
  });
  if (!values.url || !values.file || (!values["kms-key"] && !values["local-kek"])) {
    console.error("usage: client --url URL --file PATH (--kms-key NAME | --local-kek BASE64)");
    process.exit(2);
  }
  const keys = values["kms-key"] ? new GcpKms(values["kms-key"]) : LocalKeys.fromBase64(values["local-kek"]!);
  const report = await scanRemote(values.url, readFileSync(values.file, "utf8"), keys);
  console.log(JSON.stringify(report, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error((err as Error).message);
    process.exit(1);
  });
}
