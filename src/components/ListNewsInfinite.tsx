import React, { useState } from "react";
import ListItem from "./ListNewsItem";
import InfiniteScroll from "./InfiniteScroll";
import type { HerbsMeta, ReportsMeta } from "../types/staticql-types";

interface Props {
  offset: number;
}

type ListItemData = {
  key: string;
  displayName: string;
  link: string;
  content: string;
  updatedAt: Date;
};

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
        content: herb["tags.name"],
        updatedAt: herb.updatedAt,
      })
    );

    const reports: ReportsMeta = await (
      await fetch("/data/reports.meta.json")
    ).json();
    const newReports = Object.entries(reports).map(
      ([reportSlug, report]): ListItemData => ({
        key: reportSlug,
        displayName: "Report:" + report["herbs.name"],
        link: `/reports/${report.reportGroupSlug}`,
        content: "Report:" + report["herbs.name"],
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
