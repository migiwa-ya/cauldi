import crypto from 'crypto';

/**
 * ハーブ構成（herb_id + 状態 + 部位）の組み合わせから group_id を生成
 * @param {Array<{herb_id: number, herb_state_id: number, herb_part_id: number}>} herbs
 * @returns {string} group_id（短縮ハッシュ）
 */
export function generateReportGroupId(herbs) {
  // herb構成の順番が違っても同じIDになるようにソート
  const sorted = herbs
    .map(h => `${h.herb_id}-${h.herb_state_id}-${h.herb_part_id}`)
    .sort()
    .join('|');

  // ハッシュ化（MD5で十分）
  const hash = crypto.createHash('md5').update(sorted).digest('hex');

  // 必要に応じて短縮（例：最初の6桁）
  return hash.slice(0, 6);
}
