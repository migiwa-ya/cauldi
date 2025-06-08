import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, relative } from "node:path";

import { extractDiff } from "staticql/diff";
import { defineStaticQL } from "staticql";
import staticqlConfig from "../public/staticql.config.json" with { type: 'json' }
import { FsRepository } from "staticql/repo/fs";

const OUTPUT_DIR = "public";
const OUTPUT_LIST = ".changed-index";

process.env.GIT_TERMINAL_PROMPT = "0"; // suppress auth prompt
execSync("git fetch --deepen=1 origin main", { stdio: "inherit" });

const diff = await extractDiff({
  baseRef: "HEAD~1",
  headRef : "HEAD",
  baseDir: "public/",
  config: staticqlConfig,
});

const staticql = defineStaticQL(staticqlConfig)({
  repository: new FsRepository(OUTPUT_DIR),
});

const changed = await staticql.getIndexer().updateIndexesForFiles(diff);

if (changed.length) {
  // newline-separated for easy piping
  const list = changed.join("\n");
  writeFileSync(OUTPUT_LIST, list);
  console.log(`[staticql] index updated: ${changed.length} files`);
  console.log(list);

  // if running in GitHub Actions, set an output named "changed"
  if (process.env.GITHUB_OUTPUT) {
    // GITHUB_OUTPUT file is pre-created by runner
    writeFileSync(process.env.GITHUB_OUTPUT, `changed<<EOF\n${list}\nEOF\n`, {
      flag: "a",
    });
  }
} else {
  console.log("[staticql] no index changes");
}
