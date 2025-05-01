import React, { useState } from "react";
import ListItem, { type ListItemData } from "./ListItem";
import InfiniteScroll from "./InfiniteScroll";
import { toBotanicalName } from "../utils/herbs";
import { defineStaticQL } from "@migiwa-ya/staticql/browser";
import type { HerbsRecord, ReportsRecord } from "../types/staticql-types";

interface Props {
  offset: number;
}

const ListNewsInfinite: React.FC<Props> = ({ offset }) => {
  const [items, setItems] = useState<ListItemData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchItems = async () => {
    const schema = await fetch("/staticql.schema.json").then((r) => r.json());
    const staticql = defineStaticQL(schema)();

    const herbs = await staticql.from<HerbsRecord>("herbs").exec();
    const newHerbs = herbs.map(
      (herb): ListItemData => ({
        key: herb.slug,
        displayName: herb.name,
        link: `/herbs/${herb.slug}/`,
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

    const reports = await staticql.from<ReportsRecord>("reports").exec();
    const newReports = reports.map(
      (report): ListItemData => ({
        key: report.slug,
        displayName: `${report.herbs?.map((herb) => herb.name)?.join("・")}の${
          report.process?.name
        }のレポート`,
        link: `/reports/${report.reportGroupSlug}/`,
        images: (
          report.reportGroup?.combinedHerbs.map((ch) => ch.slug) ?? []
        ).map((slug: string) => ({
          path: `/images/herbs/${slug}/thumbnail.webp`,
          label: toBotanicalName(slug),
        })),
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
