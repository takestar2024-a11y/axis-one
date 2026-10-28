// HTTP API of the confidential workload.
//
// POST /v1/scan
//   { requestId, wrappedKey (base64), payload: Sealed }
// → { requestId, payload: Sealed }  (report sealed with the same DEK)
//
// Plaintext exists only in this process's memory, which Confidential Space
// keeps inside the SEV-encrypted VM. Logs never contain payload content.
import { createServer, type IncomingMessage, type Server } from "node:http";
import { open, requestAad, responseAad, seal, type Sealed } from "./envelope.js";
import type { KeyUnwrapper } from "./keys.js";
import { scan } from "./scan.js";

const MAX_BODY_BYTES = 1024 * 1024;
const REQUEST_ID = /^[A-Za-z0-9-]{8,64}$/;

export interface ScanRequest {
  requestId: string;
  wrappedKey: string;
  payload: Sealed;
}

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function createScanServer(keys: KeyUnwrapper, log: (msg: string) => void = console.log): Server {
  return createServer(async (req, res) => {
    const send = (status: number, body: unknown) => {
      res.writeHead(status, { "content-type": "application/json", "cache-control": "no-store" });
      res.end(JSON.stringify(body));
    };

    try {
      if (req.method === "GET" && req.url === "/healthz") return send(200, { ok: true });
      if (req.method !== "POST" || req.url !== "/v1/scan") throw new HttpError(404, "not found");

      const body = parseRequest(await readBody(req));
      let dek: Buffer;
      try {
        dek = await keys.unwrap(Buffer.from(body.wrappedKey, "base64"));
      } catch (err) {
        log(`scan ${body.requestId}: key unwrap failed: ${(err as Error).message}`);
        throw new HttpError(403, "key unwrap failed");
      }

      try {
        let text: string;
        try {
          text = open(dek, body.payload, requestAad(body.requestId)).toString("utf8");
        } catch {
          throw new HttpError(400, "payload authentication failed");
        }
        const report = scan(text);
        const sealed = seal(dek, Buffer.from(JSON.stringify(report)), responseAad(body.requestId));
        log(`scan ${body.requestId}: ${report.total} findings`);
        send(200, { requestId: body.requestId, payload: sealed });
      } finally {
        dek.fill(0);
      }
    } catch (err) {
      if (err instanceof HttpError) return send(err.status, { error: err.message });
      log(`internal error: ${(err as Error).message}`);
      send(500, { error: "internal error" });
    }
  });
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on("data", (c: Buffer) => {
      size += c.length;
      if (size > MAX_BODY_BYTES) {
        reject(new HttpError(413, "payload too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function parseRequest(raw: string): ScanRequest {
  let v: unknown;
  try {
    v = JSON.parse(raw);
  } catch {
    throw new HttpError(400, "invalid json");
  }
  const r = v as Partial<ScanRequest>;
  const p = r?.payload as Partial<Sealed> | undefined;
  if (
    typeof r?.requestId !== "string" ||
    !REQUEST_ID.test(r.requestId) ||
    typeof r.wrappedKey !== "string" ||
    typeof p?.iv !== "string" ||
    typeof p.ciphertext !== "string" ||
    typeof p.tag !== "string"
  ) {
    throw new HttpError(400, "invalid request");
  }
  return r as ScanRequest;
}
