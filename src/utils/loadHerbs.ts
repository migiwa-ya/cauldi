import matter from "gray-matter";
import fg from "fast-glob";
import fs from "fs-extra";
import yaml from "js-yaml";
import path from "path";
import { generateReportGroupId } from "./generateSearchData";
import type { Herb, HerbDescriptionSection } from "../types/herbs";
import type {
  Report,
  ReportHerb,
  ReportHerbRaw,
  ReportRaw,
} from "../types/reports";

const HERBS_DIR = path.resolve("src/content/herbs");
const HERB_STATES_FILE = path.resolve("src/content/herbStates.yaml");
const REPORTS_DIR = path.resolve("src/content/reports");
const HERB_PARTS_FILE = path.resolve("src/content/herbPart.yaml");

// データキャッシュ
let herbStateCache: { slug: string; name: string }[] | undefined;
let herbPartCache: { slug: string; name: string }[] | undefined;
let allHerbsCache: Herb[] | undefined;

/** HerbStates 一括ロード */
async function loadHerbStates() {
  if (!herbStateCache) {
    const raw = await fs.readFile(HERB_STATES_FILE, "utf-8");
    herbStateCache = yaml.load(raw) as { slug: string; name: string }[];
  }
  return herbStateCache;
}

/** HerbParts 一括ロード */
async function loadHerbParts() {
  if (!herbPartCache) {
    const raw = await fs.readFile(HERB_PARTS_FILE, "utf-8");
    herbPartCache = yaml.load(raw) as { slug: string; name: string }[];
  }
  return herbPartCache;
}

/** 全ハーブをロードしキャッシュ */
export async function loadAllHerbs(): Promise<Herb[]> {
  if (allHerbsCache) return allHerbsCache;

  const files = await fg(`${HERBS_DIR}/*.md`);
  const reportFiles = await fg(`${REPORTS_DIR}/*.md`);
  const herbStates = await loadHerbStates();
  const herbParts = await loadHerbParts();

  const allHerbsData: Herb[] = [];

  // Preload all herb .md into Map for fast slug lookup
  const herbMap = new Map<string, Herb>();
  for (const file of files) {
    const raw = await fs.readFile(file, "utf-8");
    const { data, content } = matter(raw);
    const slug = data.slug;

    herbMap.set(slug, {
      ...(data as Omit<Herb, "description" | "reports">),
      reports: [], // 後で詰める
      description: content
        .split(/\n(?=## )/)
        .map((section: string) => {
          const [heading, subheading, ...text] = section.split(/\n/);
          if (!heading) return;
          return {
            heading: heading.replaceAll("#", ""),
            subheading: subheading?.replaceAll("#", ""),
            text: text.join("\n"),
          };
        })
        .filter((s): s is HerbDescriptionSection => !!s),
    });
  }

  // Read and attach matching reports
  for (const herb of herbMap.values()) {
    const reports: Report[] = [];

    for (const reportFile of reportFiles) {
      const reportRaw = await fs.readFile(reportFile, "utf-8");
      const { data } = matter(reportRaw);
      const reportData = data as ReportRaw;

      const reportHerbs: ReportHerb[] = await Promise.all(
        (reportData.herbs || [])
          .map(async (rh: ReportHerbRaw) => {
            const herbData = herbMap.get(rh.slug);
            const herbState = herbStates.find(
              (s) => s.slug === rh.herbStateSlug
            );
            const herbPart = herbParts.find((p) => p.slug === rh.herbPartSlug);

            if (!herbData || !herbState || !herbPart) return;

            return {
              herb: herbData,
              herbState,
              herbPart,
            };
          })
          .filter((rh): rh is Promise<ReportHerb> => !!rh)
      );

      if (reportHerbs.some((rh) => rh.herb.slug === herb.slug)) {
        const groupId = generateReportGroupId(
          reportHerbs,
          reportData.processSlug
        );

        reports.push({
          ...reportData,
          groupId,
          herbs: reportHerbs,
          content: reportData.content,
        });
      }
    }

    herb.reports = reports;
    allHerbsData.push(herb);
  }

  allHerbsCache = allHerbsData;
  return allHerbsData;
}
