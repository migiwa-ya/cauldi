import React, { useRef, useCallback, useState } from "react";

import LoadingFooter from "./LoadingFooter";

type Props<T> = {
  items: T[];
  loadMore: CallableFunction;
  hasMore: boolean;
  ItemComponent: React.FC<{ item: T }>;
};

function InfiniteScroll<T extends { key: string }>({
  items,
  loadMore,
  hasMore,
  ItemComponent,
}: Props<T>) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [loading, setLoading] = useState(false);
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setLoading(true);
          Promise.resolve(loadMore()).finally(() => {
            setLoading(false);
          });
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loadMore, hasMore, loading]
  );

  return (
    <>
      {items.map((item, index) => (
        <ItemComponent key={item.key} item={item} />
      ))}

      <div ref={lastItemRef} />
      <LoadingFooter loading={loading && hasMore} />
    </>
  );
}

export default InfiniteScroll;
