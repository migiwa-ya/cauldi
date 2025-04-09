import React, { useRef, useCallback } from "react";

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
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loadMore, hasMore]
  );

  return (
    <>
      {items.map((item, index) => (
        <ItemComponent key={item.key} item={item} />
      ))}

      <div ref={lastItemRef} />
    </>
  );
}

export default InfiniteScroll;
