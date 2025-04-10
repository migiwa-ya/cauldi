import type { HerbDescriptionSection } from "../types/herbs";
import { marked, type Token, type Tokens } from "marked";
import markedFootnote from "marked-footnote";

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
  renderer.heading = ({ text, depth }: Tokens.Heading) => {
    if (depth === 2)
      return `<strong class="font-[Stoke] font-normal">${text}</strong>\n`;
    if (depth === 3) return `<h2 class="text-xs italic">${text}</h2>\n`;
    return `<h${depth}>${text}</h${depth}>\n`;
  };

  renderer.image = function ({ href, title, text }: Tokens.Image) {
    return `<figure><img src="${href}" alt="${text}" data-modal="true" data-img="${href}"><figcaption>${text}</figcaption></figure>`;
  };

  renderer.link = function ({ href, title, text }: Tokens.Link) {
    return `<a href="${href}" class="c-external-link" target="_blank" rel="noopener noreferrer">${text}</a>`;
  };

  marked.setOptions({ renderer });

  // 2. Markdown → HTML に変換（footnotes含む）
  const rawHtml = marked.parse(markdown) as string;

  // ステップ1: h2+h3 を <div class="c-column-head"> でラップ
  const groupedHtml = rawHtml.replace(
    /(<strong class="font-\[Stoke\] font-normal">[\s\S]*?<\/strong>\s*)(<h2 class="text-xs italic">[\s\S]*?<\/h2>\s*)?/g,
    (match, h2, h3) => `<div class="c-column-head">\n${h2}${h3 || ""}</div>\n`
  );

  // ステップ2: 各 c-column-head の直後のパラグラフ群を <div class="c-column-body"> でラップ
  const withBodyWrap = groupedHtml.replace(
    /(<div class="c-column-head">[\s\S]*?<\/div>\s*)((?:(?!<div class="c-column-head">)[\s\S])*?)(?=<div class="c-column-head">|$)/g,
    (match, heading, body) => {
      const trimmedBody = body.trim();
      if (!trimmedBody) return heading; // 空ならスキップ
      return `${heading}\n<div class="c-column-body">\n${trimmedBody}\n</div>\n`;
    }
  );

  return withBodyWrap;
}
