import React, { useState } from "react";
import ListItem from "./ListNewsItem";
import InfiniteScroll from "./InfiniteScroll";

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

const ListReportsInfinite: React.FC<Props> = ({ offset }) => {
  const [items, setItems] = useState<ListItemData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchItems = async () => {
    const reports = await (await fetch("/data/reports.index.json")).json();
    const reportGroups = await (
      await fetch("/data/reportGroups.index.json")
    ).json();
    const newReports = reports.records.map((report: any): ListItemData => {
      const reportGroup = reportGroups.records.filter(
        (rg: any) => rg.slug === report.values.reportGroupSlug
      )[0];

      return {
        key: report.slug,
        displayName:
          report.values["herbs.name"].split(" ").join("・") +
          "の" +
          reportGroup.values["processes.name"] +
          "の作り方",
        link: `/reports/${report.values.reportGroupSlug}`,
        content: "Report:" + report.values["herbs.name"],
        updatedAt: report.values.updatedAt,
      };
    });

    const newItems = newReports.slice(offset * page, offset * page + offset);

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
