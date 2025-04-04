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
function generateReportGroupId(
  herbs: { herbId: number; herbStateId?: number; herbPartId?: number }[],
  processId?: number
): string {
  const herbKey = herbs
    .map((h) => `${h.herbId}-${h.herbStateId ?? 0}-${h.herbPartId ?? 0}`)
    .sort()
    .join("|");

  const baseKey = `${herbKey}::${processId ?? 0}`;
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

  const herbs = await loadMarkdownFiles<Herb>(HERBS_DIR);
  const reports = await loadMarkdownFiles<Report>(REPORTS_DIR);

  const tags = extractTagsFromHerbs(herbs);
  const tagMap = new Map(tags.map((t) => [t.name, t.id]));

  const reportsWithGroupId = reports.map((r) => ({
    ...r,
    groupId: generateReportGroupId(r.herbs ?? [], r.processId),
  }));

  const searchData = {
    herbs: herbs.map((h) => ({
      id: h.id,
      nameJa: h.nameJa,
      nameEn: h.nameEn,
      nameScientific: h.nameScientific,
      tagIds: (h.tags || [])
        .map((tag) => tagMap.get(tag.name)!)
        .filter(Boolean),
    })),
    reports: reportsWithGroupId.map((r) => ({
      id: r.id,
      summary: r.summary,
      updatedAt: r.updatedAt,
      herbIds: r.herbs?.map((h) => h.herbId) || [],
      groupId: r.groupId,
    })),
    tags,
  };

  const herbTags = herbs
    .flatMap((h) =>
      (h.tags || []).map((tag) => ({
        herbId: h.id,
        tagId: tagMap.get(tag.name) ?? -1,
      }))
    )
    .filter((t) => t.tagId !== -1);

  await fs.ensureDir(path.dirname(OUTPUT_FILE));
  await fs.writeJSON(OUTPUT_FILE, { searchData, herbTags }, { spaces: 2 });

  console.log(`✅ 出力完了: ${OUTPUT_FILE}`);
}

main().catch(console.error);
