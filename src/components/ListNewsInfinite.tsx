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

const ListNewsInfinite: React.FC<Props> = ({ offset }) => {
  const [items, setItems] = useState<ListItemData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchItems = async () => {
    const herbs = await (await fetch("/data/herbs.index.json")).json();
    const newHerbs = herbs.records.map(
      (h: any): ListItemData => ({
        key: h.slug,
        displayName: h.values.name,
        link: `/herbs/${h.slug}`,
        content: h.values["tags.name"],
        updatedAt: h.values.updatedAt,
      })
    );

    const reports = await (await fetch("/data/reports.index.json")).json();
    const newReports = reports.records.map(
      (h: any): ListItemData => ({
        key: h.slug,
        displayName: "Report:" + h.values["herbs.name"],
        link: `/reports/${h.values.reportGroupSlug}`,
        content: "Report:" + h.values["herbs.name"],
        updatedAt: h.values.updatedAt,
      })
    );

    const newItems = [...newHerbs, ...newReports].slice(
      offset * page,
      offset * page + offset
    );

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
