// 成分（Compound）
export interface Compound {
  id: number;
  name: string;
  nameJa?: string;
  nameEn?: string;
  effect: string;
  researchPapers?: string[];
}

// ハーブ状態（例：ドライ、フレッシュ）
export interface HerbState {
  id: number;
  state: string;
}

// ハーブ部位（例：花、葉、茎）
export interface HerbPart {
  id: number;
  part: string;
}

// タグの種類
export type TagType = 'flavor' | 'mood' | 'time' | 'health';

// タグ型（src/types/herbs.ts）
export interface Tag {
  id: number;
  name: string;
  type: TagType;
  description?: string;
}

// ハーブ本体
export interface Herb {
  id: number;
  slug: string;
  name: string;
  nameJa: string;
  nameCommonJa?: string;
  nameScientific: string;
  nameEn?: string;
  compoundId?: number;
  researchPapers?: string[];
  updatedAt: string;
  tags?: Tag[]; // tag id list
  description: string; // markdown body
}
