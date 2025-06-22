import React, { useState } from "react";
import ListItem, { type ListItemData } from "./ListItem";
import InfiniteScroll from "./InfiniteScroll";
import LoadingFooter from "./LoadingFooter";
import type { HerbsRecord } from "../types/staticql-types";
import { defineStaticQL, type PageInfo } from "staticql";
import { FetchRepository } from "staticql/repo/fetch";

interface Props {
  pageInfo: PageInfo;
  tagSlug: string;
}

const ListHerbsByTagInfinite: React.FC<Props> = ({ pageInfo, tagSlug }) => {
  const [items, setItems] = useState<ListItemData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(pageInfo.endCursor);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const schema = await fetch("https://cauldi.com/staticql.config.json").then(
        (r) => r.json()
      );
      const staticql = defineStaticQL(schema)({
        repository: new FetchRepository("https://cauldi.com/"),
      });

      const herbs = await staticql
        .from<HerbsRecord>("herbs")
        .where("tagSlugs", "eq", tagSlug)
        .cursor(nextCursor)
        .pageSize(6)
        .orderBy("updatedAt", "desc")
        .exec();

      const newHerbs: ListItemData[] = Object.entries(herbs.data).map(
        ([herbSlug, herb]) => ({
          key: herbSlug,
          displayName: herb.name,
          images: [
            {
              path: `/images/herbs/${herb.slug}/thumbnail.webp`,
              label: herb.name,
            },
          ],
          link: `/herbs/${herbSlug}/`,
          content: herb.tags?.map((t) => t.name).join("・") ?? "",
          updatedAt: herb.updatedAt,
        })
      );

      setNextCursor(herbs.pageInfo.endCursor);
      setHasMore(herbs.pageInfo.hasNextPage);
      setItems((prev) => [...prev, ...newHerbs]);
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

export default ListHerbsByTagInfinite;
