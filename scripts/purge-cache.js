import fetch from "cross-fetch";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";

const LISTFILE = process.env.OUTPUT_LIST || ".changed-index";

if (!existsSync(LISTFILE) || readFileSync(LISTFILE, "utf8").trim() === "") {
  console.log(`[purge] ${LISTFILE} not found – skip cache purge`);
  process.exit(0);
}

const list = (await fs.readFile(LISTFILE, "utf8")).trim().split("\n");
const files = list.map((p) => `${process.env.CDN_ORIGIN}/${p}`);

await fetch(
  `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/purge_cache`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ files }),
  }
)
  .then((r) => r.json())
  .then(console.log);
