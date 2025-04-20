import React, { useState } from "react";
import ListItem, { type ListItemData } from "./ListItem";
import InfiniteScroll from "./InfiniteScroll";
import type { HerbsMeta, ReportsMeta } from "../types/staticql-types";
import { toBotanicalName } from "../utils/herbs";

interface Props {
  offset: number;
}

const ListNewsInfinite: React.FC<Props> = ({ offset }) => {
  const [items, setItems] = useState<ListItemData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchItems = async () => {
    const herbs: HerbsMeta = await (
      await fetch("/data/herbs.meta.json")
    ).json();
    const newHerbs = Object.entries(herbs).map(
      ([herbSlug, herb]): ListItemData => ({
        key: herbSlug,
        displayName: herb.name,
        link: `/herbs/${herbSlug}`,
        images: [
          {
            path: `/images/herbs/${herb.slug}/thumbnail.webp`,
            label: toBotanicalName(herb.slug),
          },
        ],
        content: herb.overview,
        updatedAt: herb.updatedAt,
      })
    );

    const reports: ReportsMeta = await (
      await fetch("/data/reports.meta.json")
    ).json();
    const newReports = Object.entries(reports).map(
      ([reportSlug, report]): ListItemData => ({
        key: reportSlug,
        displayName: `${report["herbs.name"]?.join("・")}の${report["process.name"]}のレポート`,
        link: `/reports/${report.reportGroupSlug}`,
        images: (report["reportGroup.combinedHerbs.slug"] ?? []).map(
          (slug: string) => ({
            path: `/images/herbs/${slug}/thumbnail.webp`,
            label: toBotanicalName(slug),
          })
        ),
        content: report.summary,
        updatedAt: report.updatedAt,
      })
    );

    const newItems = [...newHerbs, ...newReports]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(offset * page, offset * page + offset);

    setHasMore(newItems.length > 0);
    setItems((prev) => [...prev, ...newItems]);
    setPage((prev) => prev + 1);
  };

  return (
    <InfiniteScroll
      items={items}
      loadMore={fetchItems}
      hasMore={hasMore}
      ItemComponent={ListItem}
    />
  );
};

export default ListNewsInfinite;
