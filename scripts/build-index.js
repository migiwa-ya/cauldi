import { defineStaticQL, extractDiff } from "staticql";
import config from "../public/staticql.config.json";
import { FsRepository } from "staticql/repo/fs";

(async () => {
  const diff = await extractDiff({
    baseDir: "public",
    config: config,
  });

  const factory = defineStaticQL(config);
  const staticql = factory({
    repository: new FsRepository("public"),
  });

  await staticql.getIndexer().updateIndexesForFiles(diff);
})();
