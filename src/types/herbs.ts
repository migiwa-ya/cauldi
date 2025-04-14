import type { Report } from "./reports";

export interface Compound {
  slug: string;
  name: string;
  nameEn?: string;
  effect: string;
}

export interface HerbState {
  slug: string;
  name: string;
}

export interface HerbPart {
  slug: string;
  name: string;
}

export type TagType = "flavor" | "mood" | "time" | "health";

export interface Tag {
  slug: string;
  name: string;
}

export interface Herb {
  slug: string;
  name: string;
  nameScientific: string;
  nameAliases?: string[];
  compoundId?: number;
  overview: string;
  efficacy: string;
  updatedAt: Date;
  createdAt: Date;
  groupIds: string[];
  tagSlugs: string[];
  imageUrl?: string; // Added imageUrl property
  tags?: Tag[];
  content: string;
  description?: HerbDescriptionSection[];
  reports?: Report[];
}

export interface HerbDescriptionSection {
  heading: string;
  subheading: string;
  text: string;
}
