import React, { useState, useEffect } from "react";
import ListItem from "./ListItem";
import type { ListItemData } from "./ListItem";

const InfiniteScroll: React.FC = () => {
  const [visibleItems, setVisibleItems] = useState<ListItemData[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loader = React.useRef(null);

  const loadMore = async () => {
    const response = await fetch("/search-data.json");
    const data = await response.json();
    const newHerbs = data.searchData.herbs.slice(
      visibleItems.length,
      visibleItems.length + 5
    );
    const newReports = data.searchData.reports.slice(
      visibleItems.length,
      visibleItems.length + 5
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
