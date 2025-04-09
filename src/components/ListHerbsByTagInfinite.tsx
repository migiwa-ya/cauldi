import React, { useState } from "react";
import ListItem from "./ListNewsItem";
import InfiniteScroll from "./InfiniteScroll";

interface Props {
  offset: number;
  slug: string;
}

type ListItemData = {
  key: string;
  displayName: string;
  link: string;
  content: string;
  updatedAt: Date;
};

const ListHerbsByTagInfinite: React.FC<Props> = ({ offset, slug }) => {
  const [items, setItems] = useState<ListItemData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchItems = async () => {
    const herbs = await (await fetch("/data/herbs.index.json")).json();
    const newHerbs: ListItemData[] = herbs.records
      .filter((h: any) => (h.values["tags.slug"] ?? "").includes(slug))
      .map((h: any) => ({
        key: h.slug,
        displayName: h.values.name,
        link: `/herbs/${h.slug}`,
        content: h.values["tags.name"],
        updatedAt: h.values.updatedAt,
      }));

    const newItems = newHerbs
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

export default ListHerbsByTagInfinite;
