import matter from "gray-matter";
import { generateReportGroupId } from "./generateSearchData";
import type { Report, ReportHerb, ReportHerbRaw } from "../types/reports";
import fg from "fast-glob";
import fs from "fs-extra";
import path from "path";
import {
  getHerbBySlug,
  getHerbPartBySlug,
  getHerbStateBySlug,
} from "./loadHerbs";

const REPORTS_DIR = path.resolve("src/content/reports");

/**
 * すべてのレポートを読み込む
 */
export async function loadAllReports(): Promise<Report[]> {
  const files = await fg(`${REPORTS_DIR}/*.md`);
  const reports: Report[] = [];

  for (const file of files) {
    const raw = await fs.readFile(file, "utf-8");
    const { data, content } = matter(raw);
    const reportHerbs =
      (await Promise.all(
        data.herbs.map(async (rh: ReportHerbRaw) => {
          const herb = await getHerbBySlug(rh.slug);
          const herbState = await getHerbStateBySlug(rh.herbStateSlug);
          const herbPart = await getHerbPartBySlug(rh.herbPartSlug);

          return {
            ...rh,
            name: herb?.name,
            nameScientific: herb?.nameScientific,
            herbState,
            herbPart,
          };
        })
      )) || [];
    const groupId = generateReportGroupId(reportHerbs, data.processSlug);
    reports.push({
      id: parseInt(path.basename(file, ".md")),
      summary: data.summary,
      updatedAt: data.updatedAt,
      content: content.trim(),
      processSlug: data.processSlug || "unknown",
      usageSlug: data.usageSlug || "unknown",
      groupId,
      herbs: reportHerbs,
    });
  }

  return reports.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}
