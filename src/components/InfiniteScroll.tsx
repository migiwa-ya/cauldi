import React, { useState, useEffect } from "react";
import ListItem from "./ListItem";
import type { ListItemData } from "./ListItem";

const InfiniteScroll: React.FC = () => {
  const [visibleItems, setVisibleItems] = useState<ListItemData[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loader = React.useRef(null);

  const loadMore = async () => {
    const herbs = await (await fetch("/data/herbs.index.json")).json();
    const newHerbs = herbs.records
      .slice(visibleItems.length, visibleItems.length + 5)
      .map(
        (h: any): ListItemData => ({
          id: h.slug,
          displayName: h.values.name,
          link: `/herbs/${h.slug}`,
          content: h.values["tags.name"],
          updatedAt: h.values.updatedAt,
        })
      );

    const reports = await (await fetch("/data/reports.index.json")).json();
    const newReports = reports.records
      .slice(visibleItems.length, visibleItems.length + 5)
      .map(
        (h: any): ListItemData => ({
          id: h.slug,
          displayName: "Report:" + h.values["herbs.name"],
          link: `/reports/${h.values.reportGroupSlug}`,
          content: "Report:" + h.values["herbs.name"],
          updatedAt: h.values.updatedAt,
        })
      );

    const newItems = [...newHerbs, ...newReports];

    if (newItems.length === 0) {
      setHasMore(false);
      return;
    }

    setVisibleItems((prevItems) => [...prevItems, ...newItems]);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [visibleItems]);

  return (
    <>
      {visibleItems.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
      {hasMore && (
        <div ref={loader} className="mt-4 p-2 bg-blue-500 text-white">
          Loading more items...
        </div>
      )}
    </>
  );
};

export default InfiniteScroll;
