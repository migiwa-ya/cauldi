import matter from 'gray-matter';
import fg from 'fast-glob';
import fs from 'fs-extra';
import path from 'path';
import type { Herb } from '../types/herbs';

const HERBS_DIR = path.resolve('src/content/herbs');

/**
 * すべてのハーブを読み込む
 */
export async function loadAllHerbs(): Promise<Herb[]> {
  const files = await fg(`${HERBS_DIR}/*.md`);
  const herbs: Herb[] = [];

  for (const file of files) {
    const raw = await fs.readFile(file, 'utf-8');
    const { data, content } = matter(raw);
    herbs.push({
      ...(data as Omit<Herb, 'description'>),
      description: content.trim(),
    });
  }

  return herbs;
}

/**
 * slug (scientific name) からハーブを1件取得
 */
export async function getHerbBySlug(slug: string): Promise<Herb | undefined> {
  const all = await loadAllHerbs();
  return all.find(h => h.slug === slug);
}
