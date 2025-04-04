// 製法（Process）
export interface Process {
  id: number;
  nameEn: string;
  nameJa: string;
  description: string;
}

// 飲み方・使い方（UsageMethod）
export interface UsageMethod {
  id: number;
  nameEn: string;
  nameJa: string;
  description: string;
}

// レポートでのハーブ使用情報
export interface ReportHerb {
  herbId: number;
  herbStateId?: number;
  herbPartId?: number;
  description?: string;
}

// レポートに紐づく画像
export interface ReportImage {
  imageUrl: string;
  name?: string;
  caption?: string;
  sortOrder?: number;
}

// レポートに含まれる風味評価
export interface ReportFlavor {
  bitterness: number;
  sweetness: number;
  sourness: number;
  spiciness: number;
  astringency: number;
  umami: number;
  aromaType?: string;
  aromaIntensity?: number;
  aftertaste?: string;
}

// レポート全体
export interface Report {
  id: number;
  summary?: string;
  processId?: number;
  usageMethodId?: number;
  updatedAt: string;
  herbs: ReportHerb[];
  flavor?: ReportFlavor;
  images?: ReportImage[];
  content: string; // markdown body
  groupId?: string; // ← スクリプトで自動生成して追加する
}

