# securify confidential workload（MVP）

処理中のデータも暗号化したまま扱うための最小構成です。Google Cloud の **Confidential Space**（AMD SEV のコンフィデンシャル VM）上で動かします。

利用者が送った文書を TEE（ハードウェアで隔離された実行環境）の中だけで復号し、機密情報（カード番号・マイナンバー・メールアドレス・電話番号）を検出します。結果は暗号化して返します。

## 何が守られるか

```
利用者の手元                         Google Cloud
──────────                         ───────────────────────────────────────────
1. データ鍵(DEK)を生成
2. 本文を DEK で AES-256-GCM 暗号化
3. DEK を Cloud KMS で包む(wrap) ─▶ KMS: 利用者は「暗号化」権限のみ。復号はできない
4. 暗号文 + 包んだ DEK を送信   ─▶ Confidential Space VM（メモリは SEV で暗号化）
                                     ├ 起動時に Google の検証サービスがアテステーション
                                     │  （本番イメージか・デバッグ無効か・コンテナのダイジェスト）
                                     ├ 条件を満たしたときだけ一時トークンが発行される
                                     ├ そのトークンでのみ KMS の「復号」権限が得られる
                                     ├ DEK を取り出し、TEE 内でだけ平文に戻して検査
                                     └ 結果を同じ DEK で暗号化して返す（生の値は含めない）
5. 結果を DEK で復号            ◀─
```

- **クラウドの管理者・ホスト OS・securify の運用者:** VM のメモリは暗号化されており、DEK も TEE 内でしか平文になりません。
- **改ざんされたプログラム:** コンテナのダイジェストが1文字でも違えば、KMS は鍵を渡しません。
- **デバッグ版イメージ:** `STABLE` 属性と `dbgstat` の条件ではじきます。
- **リクエストと応答のすり替え:** AES-GCM の追加認証データに、リクエスト ID と通信の向きを含めています。
- **ログ:** 件数とリクエスト ID しか出しません。検査結果も、生の値ではなく末尾4桁などのマスク済みの値だけです。

## 守れないもの（多層防御で補う前提）

- **正規の認証情報が盗まれた場合:** 盗んだ人も正規の利用者として扱われます。MFA と IAM の最小権限で防ぎます。
- **TEE 自体の脆弱性:** サイドチャネル攻撃や物理攻撃です。CPU のファームウェアを更新し、Confidential Space のイメージを最新に保ちます。
- **量子計算機による将来の解読:** 耐量子暗号（PQC）への移行計画が別途必要です。
- **通信路:** この MVP は HTTP（8080番ポート）です。中身は暗号化済みですが、本番では TLS（ロードバランサや証明書）を追加してください。

## ディレクトリ

| パス | 内容 |
| --- | --- |
| `workload/src/envelope.ts` | AES-256-GCM による封筒暗号化 |
| `workload/src/keys.ts` | Cloud KMS による鍵の wrap/unwrap、アテステーション用の認証情報 |
| `workload/src/scan.ts` | 機密情報の検出（Luhn、マイナンバーのチェックデジット） |
| `workload/src/server.ts` | `POST /v1/scan` と `GET /healthz` |
| `workload/src/client.ts` | 利用者側の CLI（暗号化 → 送信 → 復号） |
| `workload/Dockerfile` | Confidential Space の起動ポリシー付きイメージ |
| `infra/` | Terraform（KMS、Workload Identity、コンフィデンシャル VM） |

## ローカルで試す（TEE なし・動作確認用）

```bash
cd confidential/workload
npm install
npm test

KEK=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
SECURIFY_ALLOW_LOCAL_KEYS=1 LOCAL_KEK=$KEK npm start &
echo "連絡先 taro@example.com カード 4111 1111 1111 1111" > /tmp/sample.txt
node dist/src/client.js --url http://localhost:8080 --file /tmp/sample.txt --local-kek $KEK
```

ローカルモードには、TEE とアテステーションの保証がありません。本番では `SECURIFY_ALLOW_LOCAL_KEYS` を設定しないでください。

## Google Cloud への導入

前提として、Terraform 1.5 以上、gcloud、Docker、課金が有効なプロジェクトが必要です。

```bash
# 1. 基盤を作る（VM 以外）
cd confidential/infra
cp terraform.tfvars.example terraform.tfvars   # project_id などを編集
terraform init && terraform apply

# 2. イメージをビルドして push
REPO=$(terraform output -raw image_repo)
gcloud auth configure-docker asia-northeast1-docker.pkg.dev
docker build -t $REPO:v1 ../workload && docker push $REPO:v1

# 3. ダイジェストを固定して VM を作る
DIGEST=$(gcloud artifacts docker images describe $REPO:v1 --format='value(image_summary.digest)')
terraform apply -var="image_digest=$DIGEST"

# 4. 利用者側から呼ぶ
node ../workload/dist/src/client.js \
  --url $(terraform output -raw workload_url) \
  --file /tmp/sample.txt \
  --kms-key $(terraform output -raw kms_key_name)
```

コードを変えたら、2〜3 をやり直します。ダイジェストが変わるため、古いイメージは鍵を受け取れなくなります。

## 費用の目安

- **コンフィデンシャル VM（n2d-standard-2）:** 24時間稼働で月数十ドル程度
- **Cloud KMS:** 鍵1本あたり月数十セント＋操作回数に応じた料金
- **Artifact Registry・ネットワーク:** わずか

金額は、導入前に Google Cloud の料金計算ツールで確認してください。GPU（H100 など）で AI 推論まで守る場合は、桁が変わります。

## 次の段階

1. TLS 終端と、利用者ごとの認証（API キーまたは OIDC）
2. 監査ログの保存（Cloud Logging のログ保持ポリシー）
3. 検出ルールの追加（住所・氏名・口座番号など）
4. コンフィデンシャル GPU による AI 推論（プライベート推論）
5. 他のクラウドへの対応（Azure Confidential VM＋Secure Key Release、さくらインターネット）。鍵の受け渡しは `KeyUnwrapper` インターフェースで差し替えられます
