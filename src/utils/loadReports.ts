import matter from 'gray-matter';
import { generateReportGroupId } from './generateSearchData';
import type { Report } from '../types/reports';
import fg from 'fast-glob';
import fs from 'fs-extra';
import path from 'path';

const REPORTS_DIR = path.resolve('src/content/reports');

/**
 * すべてのレポートを読み込む
 */
export async function loadAllReports(): Promise<Report[]> {
  const files = await fg(`${REPORTS_DIR}/*.md`);
  const reports: Report[] = [];

  for (const file of files) {
    const raw = await fs.readFile(file, 'utf-8');
    const { data, content } = matter(raw);
    const groupId = generateReportGroupId(data.herbs, data.processId);
    reports.push({
      id: parseInt(path.basename(file, '.md')),
      summary: data.summary,
      updatedAt: data.updatedAt,
      content: content.trim(),
      processSlug: data.processSlug || "unknown",
      usageSlug: data.usageSlug || "unknown",
      groupId,
      herbs: data.herbs || [],
    });
  }

  return reports.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}
