// scripts/upload-r2.js
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { readFile, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";

// ---------- config & helpers --------------------------------------
const BUCKET = process.env.R2_BUCKET;
const ENDPOINT = process.env.R2_ENDPOINT; // https://<account>.r2.cloudflarestorage.com
const ACCESS = process.env.R2_ACCESS_KEY_ID;
const SECRET = process.env.R2_SECRET_ACCESS_KEY;
const PUBLIC = "public"; // build output dir
const LISTFILE = process.env.OUTPUT_LIST || ".changed-index";

if (!BUCKET || !ENDPOINT || !ACCESS || !SECRET) {
  console.error("❌  R2 credentials / endpoint missing");
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: ENDPOINT,
  credentials: { accessKeyId: ACCESS, secretAccessKey: SECRET },
});

const read = promisify(readFile);

// ---------- main ---------------------------------------------------
(async () => {
  if (!existsSync(LISTFILE) || readFileSync(LISTFILE, "utf8").trim() === "") {
    console.log(`[upload-r2] ${LISTFILE} not found – nothing to upload`);
    process.exit(0);
  }

  const paths = readFileSync(LISTFILE, "utf8")
    .trim()
    .split("\n")
    .filter(Boolean);

  for (const relPath of paths) {
    const abs = join(PUBLIC, relPath);

    if (existsSync(abs)) {
      // -- ファイルが存在 → PUT (更新/追加)
      const Body = await read(abs);
      await s3.send(
        new PutObjectCommand({ Bucket: BUCKET, Key: relPath, Body })
      );
      console.log("↑ PUT", relPath);
    } else {
      // -- 存在しない → 削除レコード or 既にビルドで消えた
      // console.log("– skip (not found)", relPath);
      await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: relPath }));
      console.log("✕ DELETE", relPath);
    }
  }
})();
