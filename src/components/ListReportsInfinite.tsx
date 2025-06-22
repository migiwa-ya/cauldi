import React, { useState } from "react";
import ListItem, { type ListItemData } from "./ListItem";
import InfiniteScroll from "./InfiniteScroll";
import { defineStaticQL } from "staticql";
import { FetchRepository } from "staticql/repo/fetch";
import type { ReportsRecord } from "../types/staticql-types";

interface Props {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}

const ListReportsInfinite: React.FC<Props> = ({ pageInfo }) => {
  const [items, setItems] = useState<ListItemData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(pageInfo.endCursor);

  const fetchItems = async () => {
    const schema = await fetch("/staticql.config.json").then((r) => r.json());
    const staticql = defineStaticQL(schema)({
      repository: new FetchRepository("/"),
    });

    const reports = await staticql
      .from<ReportsRecord>("reports")
      .join("herbs")
      .join("reportGroup")
      .join("process")
      .cursor(nextCursor)
      .pageSize(6)
      .orderBy("updatedAt", "desc")
      .exec();

    const newReports: ListItemData[] = reports.data.map(
      (report): ListItemData => {
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
      }
    );

    setNextCursor(reports.pageInfo.endCursor);
    setHasMore(reports.pageInfo.hasNextPage);
    setItems((prev) => [...prev, ...newReports]);
    setPage((prev) => prev + 1);
  };

  return (
    <>
      <InfiniteScroll
        items={items}
        loadMore={fetchItems}
        hasMore={hasMore}
        ItemComponent={ListItem}
      />
    </>
  );
};

export default ListReportsInfinite;
