import React, { useState } from "react";
import ListItem, { type ListItemData } from "./ListItem";
import InfiniteScroll from "./InfiniteScroll";
import type { ReportsMeta } from "../types/staticql-types";

interface Props {
  offset: number;
}

const ListReportsInfinite: React.FC<Props> = ({ offset }) => {
  const [items, setItems] = useState<ListItemData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchItems = async () => {
    const reports: ReportsMeta = await (
      await fetch("/data/reports.meta.json")
    ).json();

    const newReports: ListItemData[] = Object.entries(reports).map(
      ([reportSlug, report]): ListItemData => {
        return {
          key: reportSlug,
          displayName:
            report["herbs.name"]?.join("・") +
            "の" +
            report["process.name"] +
            "の作り方",
          images: (report["reportGroup.combinedHerbs.slug"] ?? []).map(
            (slug: string) => ({
              path: `/images/herbs/${slug}/thumbnail.webp`,
              label: slug,
            })
          ),
          link: `/reports/${report.reportGroupSlug}`,
          content: "Report:" + report["herbs.name"],
          updatedAt: report.updatedAt,
        };
      }
    );

    const newItems = newReports
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

export default ListReportsInfinite;
