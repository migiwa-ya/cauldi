import React, { useState } from "react";
import ListItem, { type ListItemData } from "./ListItem";
import InfiniteScroll from "./InfiniteScroll";
import { defineStaticQL } from "@migiwa-ya/staticql/browser";
import type { ReportsRecord } from "../types/staticql-types";

interface Props {
  offset: number;
}

const ListReportsInfinite: React.FC<Props> = ({ offset }) => {
  const [items, setItems] = useState<ListItemData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchItems = async () => {
    const schema = await fetch("/staticql.schema.json").then((r) => r.json());
    const staticql = defineStaticQL(schema)();
    const reports = await staticql
      .from<ReportsRecord>("reports")
      .join("herbs")
      .join("process")
      .exec();

    const newReports: ListItemData[] = reports.map((report): ListItemData => {
      return {
        key: report.slug,
        displayName:
          report.herbs?.map((herb) => herb.name)?.join("・") +
          "の" +
          report.process?.name +
          "の作り方",
        images: (
          report.reportGroup?.combinedHerbs.map((ch) => ch.slug) ?? []
        ).map((slug: string) => ({
          path: `/images/herbs/${slug}/thumbnail.webp`,
          label: slug,
        })),
        link: `/reports/${report.reportGroupSlug}/`,
        content: "Report:" + report.herbs?.map((herb) => herb.name),
        updatedAt: report.updatedAt,
      };
    });

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
