import { marked, type Token, type Tokens } from "marked";
import markedFootnote from "marked-footnote";

interface HerbDescriptionSection {
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

marked.use(markedFootnote({ description: "" }));

export function renderMarkdownWithCustomLayout(markdown: string) {
  // 1. カスタム heading タグ変換
  const renderer = new marked.Renderer();

  renderer.image = function ({ href, title, text }: Tokens.Image) {
    return `<figure><img src="${href}" alt="${text}" data-modal="true" data-img="${href}"><figcaption>${text}</figcaption></figure>`;
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
