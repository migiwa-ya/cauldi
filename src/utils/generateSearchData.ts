import matter from "gray-matter";
import fg from "fast-glob";
import fs from "fs-extra";
import path from "path";
import crypto from "crypto";
import type { Herb, Tag } from "../types/herbs";
import type { Report } from "../types/reports";

/**
 * グループIDを生成（herbs + processId を元に）
 */
export function generateReportGroupId(
  herbs: { slug: string; herbStateId?: number; herbPartId?: number }[],
  process?: string
): string {
  const herbKey = herbs
    .map((h) => `${h.slug}-${h.herbStateId ?? 0}-${h.herbPartId ?? 0}`)
    .sort()
    .join("|");

  const baseKey = `${herbKey}::${process ?? "unknown"}`;
  const hash = crypto.createHash("md5").update(baseKey).digest("hex");

  return hash.slice(0, 6);
}

/**
 * Markdown ファイル群を読み込んで frontmatter を抽出
 */
async function loadMarkdownFiles<T>(dir: string): Promise<T[]> {
  const files = await fg(`${dir}/*.md`);
  const data: T[] = [];

  for (const file of files) {
    const raw = await fs.readFile(file, "utf-8");
    const { data: frontmatter } = matter(raw);
    data.push(frontmatter as T);
  }

  return data;
}

/**
 * ハーブ一覧からユニークなタグ一覧を抽出
 */
function extractTagsFromHerbs(herbs: Herb[]): Tag[] {
  const tagMap = new Map<string, Tag>();

  herbs.forEach((h) => {
    (h.tags || []).forEach((tag) => {
      if (!tagMap.has(tag.name)) {
        tagMap.set(tag.name, {
          id: tagMap.size + 1,
          name: tag.name,
          type: tag.type,
          description: tag.description,
        });
      }
    });
  });

  // IDを確定（1から順に再採番）
  const tags: Tag[] = Array.from(tagMap.values()).map((tag, index) => ({
    ...tag,
    id: index + 1,
  }));

  return tags;
}

/**
 * メイン処理
 */
async function main() {
  const HERBS_DIR = "src/content/herbs";
  const REPORTS_DIR = "src/content/reports";
  const OUTPUT_FILE = "public/search-data.json";

  const herbs = (await loadMarkdownFiles<Herb>(HERBS_DIR)).slice(0, 10);
  const reports = (await loadMarkdownFiles<Report>(REPORTS_DIR)).slice(0, 10);

  const tags = extractTagsFromHerbs(herbs);
  const tagMap = new Map(tags.map((t) => [t.name, t.id]));

  const reportsWithGroupId = reports.map((r) => ({
    ...r,
    groupId: generateReportGroupId(r.herbs ?? [], r.processSlug),
  }));

  const searchData = {
    herbs: herbs.map((h) => ({
      id: h.slug,
      displayName: h.nameJa || h.nameEn,
      link: `/herbs/${h.slug}`,
      content: h.description,
      updatedAt: h.updatedAt,
    })),
    reports: reportsWithGroupId.map((r) => ({
      id: r.id,
      displayName: `Report ${r.id}`,
      link: `/reports/${r.groupId || r.id}`,
      content: r.summary || "No content available",
      updatedAt: r.updatedAt,
      herbSlugs: r.herbs?.map((h) => h.slug) || [],
      groupId: r.groupId,
    })),
    tags,
  };

  const herbTags = herbs
    .flatMap((h) =>
      (h.tags || []).map((tag) => ({
        herbSlug: h.slug,
        tagId: tagMap.get(tag.name) ?? -1,
      }))
    )
    .filter((t) => t.tagId !== -1);

  await fs.ensureDir(path.dirname(OUTPUT_FILE));
  await fs.writeJSON(OUTPUT_FILE, { searchData, herbTags }, { spaces: 2 });

  console.log(`✅ 出力完了: ${OUTPUT_FILE}`);
}

main().catch(console.error);
