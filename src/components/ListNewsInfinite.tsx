import React, { useState } from "react";
import ListItem, { type ListItemData } from "./ListItem";
import InfiniteScroll from "./InfiniteScroll";
import LoadingFooter from "./LoadingFooter";
import { toBotanicalName } from "../utils/herbs";
import { defineStaticQL, type PageInfo } from "staticql";
import { FetchRepository } from "staticql/repo/fetch";
import type { HerbsRecord, ReportsRecord } from "../types/staticql-types";

interface Props {
  herbPageInfo: PageInfo;
  reportPageInfo: PageInfo;
}

const ListNewsInfinite: React.FC<Props> = ({
  herbPageInfo,
  reportPageInfo,
}) => {
  const [items, setItems] = useState<ListItemData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [herbNextCursor, setHerbNextCursor] = useState(herbPageInfo.endCursor);
  const [reportNextCursor, setReportNextCursor] = useState(
    reportPageInfo.endCursor
  );
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const schema = await fetch("/staticql.config.json").then(
        (r) => r.json()
      );
      const staticql = defineStaticQL(schema)({
        repository: new FetchRepository("/"),
      });

      const herbs = await staticql
        .from<HerbsRecord>("herbs")
        .orderBy("updatedAt", "desc")
        .cursor(herbNextCursor)
        .pageSize(3)
        .exec();

      const reports = await staticql
        .from<ReportsRecord>("reports")
        .join("herbs")
        .join("reportGroup")
        .join("process")
        .orderBy("updatedAt", "desc")
        .cursor(reportNextCursor)
        .pageSize(3)
        .exec();

      const newHerbs = herbs.data.map(
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

      const newReports = reports.data.map(
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

      const newItems = [...newHerbs, ...newReports].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      setHerbNextCursor(herbs.pageInfo.endCursor);
      setReportNextCursor(reports.pageInfo.endCursor);
      setHasMore(herbs.pageInfo.hasNextPage || reports.pageInfo.hasNextPage);
      setItems((prev) => [...prev, ...newItems]);
      setPage((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <InfiniteScroll
        items={items}
        loadMore={fetchItems}
        hasMore={hasMore}
        ItemComponent={ListItem}
      />
      <LoadingFooter loading={loading && hasMore} />
    </>
  );
};

export default ListNewsInfinite;
