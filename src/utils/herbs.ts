import type { HerbDescriptionSection } from "../types/herbs";

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
