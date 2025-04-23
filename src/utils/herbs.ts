import { marked, type Tokens } from "marked";
import markedFootnote from "marked-footnote";
marked.use(markedFootnote({ description: "", refMarkers: true }));

export interface HerbDescriptionSection {
  heading: string;
  subheading: string;
  text: string;
}

export function toBotanicalName(kebab: string) {
  const [genus, species] = kebab.split("-");
  if (!genus || !species) return kebab;

  const capitalizedGenus =
    genus.charAt(0).toUpperCase() + genus.slice(1).toLowerCase();
  const lowerSpecies = species.toLowerCase();

  return `${capitalizedGenus} ${lowerSpecies}`;
}

export function yamlContentSplitSection(content: string) {
  return content
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
    .filter((s): s is HerbDescriptionSection => !!s);
}

export function renderMarkdownWithCustomLayout(markdown: string) {
  // 1. カスタム heading タグ変換
  const renderer = new marked.Renderer();

  renderer.image = function ({ href, title, text }: Tokens.Image) {
    return `<figure><img src="${href}" alt="${text}" data-modal="true" data-img="${href}" loading="lazy" width="300" height="270"></figure>`;
  };

  renderer.link = function ({ href, title, text }: Tokens.Link) {
    return `<a href="${href}" class="externalLink" target="_blank" rel="noopener noreferrer">${text}</a>`;
  };

  marked.setOptions({ renderer });

  // 2. Markdown → HTML に変換（footnotes含む）
  const rawHtml = marked.parse(markdown) as string;

  // ステップ1: h2+h3 を <div class="columnHead"> でラップ
  const groupedHtml = rawHtml.replace(
    /<h2>([\s\S]*?)<\/h2>\s*<h3>([\s\S]*?)<\/h3>\s*?/g,
    (match, h2, h3) =>
      `<div class="columnHead">\n<strong>${h2}</strong><h2>${h3}</h2></div>\n`
  );

  // ステップ2: 各 columnHead の直後のパラグラフ群を <div class="columnBody"> でラップ
  const withBodyWrap = groupedHtml.replace(
    /(<div class="columnHead">[\s\S]*?<\/div>\s*)((?:(?!<div class="columnHead">)[\s\S])*?)(?=<div class="columnHead">|$)/g,
    (match, heading, body) => {
      const trimmedBody = body.trim();
      if (!trimmedBody) return heading; // 空ならスキップ
      return `${heading}\n<div class="columnBody">\n${trimmedBody}\n</div>\n`;
    }
  );

  return withBodyWrap;
}

export interface ReferenceItem {
  label: string;
  url: string;
}

/**
 * Markdown中の脚注風リスト（[^1]: [タイトル](URL)）を抽出する
 * @param markdown - 対象のMarkdown文字列
 * @returns ReferenceItem[] - 参考文献リスト
 */
export function extractFootnoteReferencesFromMarkdown(
  markdown: string
): ReferenceItem[] {
  const references: ReferenceItem[] = [];

  // Markdown を行単位で処理して脚注形式の行だけ抜き出す
  const lines = markdown.split("\n");

  const regex = /^\s*-\s+\[\^\d+\]:\s+\[(.+?)\]\((https?:\/\/.+?)\)/;

  for (const line of lines) {
    const match = line.match(regex);
    if (match) {
      references.push({
        label: match[1],
        url: match[2],
      });
    }
  }

  return references;
}

const scholarlyDomains: string[] = [
  "pmc.ncbi.nlm.nih.gov", // PubMed Central
  "pubmed.ncbi.nlm.nih.gov", // PubMed
  "bnrc.springeropen.com", // SpringerOpen
  "link.springer.com", // Springer
  "www.sciencedirect.com", // ScienceDirect
  "www.jstage.jst.go.jp", // J-STAGE（日本の論文）
  "www.mdpi.com", // MDPI（オープンアクセス学術出版）
  "www.frontiersin.org", // Frontiers（国際ジャーナル）
];

/**
 * 与えられたURLが ScholarlyArticle として適しているか（ドメインベース）
 * @param url 判定対象のURL
 * @returns boolean
 */
export function isScholarlyArticleUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return scholarlyDomains.some((domain) => parsed.hostname.includes(domain));
  } catch {
    return false;
  }
}

export const trustedWebPageDomains: string[] = [
  "www.ejim.mhlw.go.jp", // 厚労省eJIM
  "www.nibiohn.go.jp", // 国立健康・栄養研究所
  "www.nibn.go.jp", // 上記と関連
  "www.pharm.or.jp", // 日本薬学会
  "www.medicalherb.or.jp", // 日本メディカルハーブ協会
  "www.mountsinai.org", // Mount Sinai 医療機関
  "www.pages.fr", // 海外の製薬/ハーブサイト
  "www.healthline.com", // 健康系大手メディア
  "www.herbsociety.org", // Herb Society of America
  "globinmed.com", // アジアの伝統医療DB
  "iris.who.int", // WHO文書
  "www.ncbi.nlm.nih.gov", // NCBI（書籍/辞書）
  "www.sbfoods.co.jp", // エスビー食品（国内ハーブ情報）
  "hort.extension.wisc.edu", // ウィスコンシン大学植物拡張部
  "landscapeplants.oregonstate.edu", // オレゴン州立大植物図鑑
  "www.kgu-greenken.or.jp", // 関西グリーン研究所
];

/**
 * 与えられたURLが WebPage (@type) として信頼できるものか（ドメインベース）
 * @param url 判定対象のURL
 * @returns boolean
 */
export function isTrustedWebPageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return trustedWebPageDomains.some((domain) =>
      parsed.hostname.includes(domain)
    );
  } catch {
    return false;
  }
}
