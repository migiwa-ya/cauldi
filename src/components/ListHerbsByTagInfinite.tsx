import React, { useState } from "react";
import ListItem from "./ListNewsItem";
import InfiniteScroll from "./InfiniteScroll";
import type { HerbsRecord } from "../types/staticql-types";

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
    const herbs: HerbsRecord[] = await (
      await fetch("/data/herbs.meta.json")
    ).json();
    const newHerbs: ListItemData[] = Object.entries(herbs)
      .filter(([_, herb]) => herb.tags?.map((t) => t.slug).includes(slug))
      .map(([herbSlug, herb]) => ({
        key: herbSlug,
        displayName: herb.name,
        link: `/herbs/${herbSlug}`,
        content: herb.tags?.map((t) => t.name).join("・") ?? "",
        updatedAt: herb.updatedAt,
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
