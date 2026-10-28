import assert from "node:assert/strict";
import { test } from "node:test";
import type { AddressInfo } from "node:net";
import { newDataKey, open, requestAad, responseAad, seal } from "../src/envelope.js";
import { LocalKeys } from "../src/keys.js";
import { luhn, myNumberCheck, scan } from "../src/scan.js";
import { createScanServer } from "../src/server.js";
import { scanRemote } from "../src/client.js";

test("envelope round-trips and rejects a swapped aad", () => {
  const key = newDataKey();
  const sealed = seal(key, Buffer.from("秘密のデータ"), requestAad("req-12345678"));
  assert.equal(open(key, sealed, requestAad("req-12345678")).toString(), "秘密のデータ");
  assert.throws(() => open(key, sealed, responseAad("req-12345678")));
  assert.throws(() => open(newDataKey(), sealed, requestAad("req-12345678")));
});

test("check digits", () => {
  assert.ok(luhn("4111111111111111"));
  assert.ok(!luhn("4111111111111112"));
  assert.ok(myNumberCheck("123456789018"));
  assert.ok(!myNumberCheck("123456789012"));
});

test("scan finds and masks sensitive values without leaking them", () => {
  const text = [
    "連絡先: taro.yamada@example.co.jp / 090-1234-5678",
    "カード: 4111 1111 1111 1111",
    "マイナンバー: 1234 5678 9018",
    "注文番号: 1234 5678 9012", // fails the my number check digit
  ].join("\n");
  const r = scan(text);
  assert.deepEqual(r.counts, { credit_card: 1, my_number: 1, email: 1, phone_jp: 1 });
  const serialized = JSON.stringify(r);
  for (const raw of ["taro.yamada", "4111 1111 1111 1111", "1234 5678 9018", "090-1234-5678"]) {
    assert.ok(!serialized.includes(raw), `report leaked ${raw}`);
  }
  assert.equal(r.findings.find((f) => f.type === "credit_card")?.masked, "************1111");
});

test("end-to-end through the HTTP server with local keys", async () => {
  const keys = LocalKeys.generate();
  const logs: string[] = [];
  const server = createScanServer(keys, (m) => logs.push(m)).listen(0);
  await new Promise((r) => server.once("listening", r));
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  try {
    const report = (await scanRemote(url, "mail: hanako@example.com", keys)) as { total: number };
    assert.equal(report.total, 1);
    assert.ok(logs.every((l) => !l.includes("hanako")), "logs must not contain plaintext");

    // A client holding a different key-encryption key cannot get a report.
    await assert.rejects(scanRemote(url, "x", LocalKeys.generate()), /403/);

    const bad = await fetch(`${url}/v1/scan`, { method: "POST", body: "{}" });
    assert.equal(bad.status, 400);
  } finally {
    server.close();
  }
});
