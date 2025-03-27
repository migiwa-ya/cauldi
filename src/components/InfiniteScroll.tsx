import React, { useState, useEffect } from "react";
import ListItem from "./ListItem";

interface Item {
  id: number;
  name: string;
  name_scientific: string;
  description: string;
}

const InfiniteScroll: React.FC = () => {
  const [visibleItems, setVisibleItems] = useState<Item[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Simulate fetching new items
  const fetchNewItems = async (
    start: number,
    count: number
  ): Promise<Item[]> => {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Simulate fetching items
    const allItems = [
      {
        id: 1,
        name: "Herb 1",
        name_scientific: "ScientificName1",
        description: "Description for Herb 1",
      },
      {
        id: 2,
        name: "Herb 2",
        name_scientific: "ScientificName2",
        description: "Description for Herb 2",
      },
      {
        id: 3,
        name: "Herb 3",
        name_scientific: "ScientificName3",
        description: "Description for Herb 3",
      },
      {
        id: 4,
        name: "Herb 4",
        name_scientific: "ScientificName4",
        description: "Description for Herb 4",
      },
      {
        id: 5,
        name: "Herb 5",
        name_scientific: "ScientificName5",
        description: "Description for Herb 5",
      },
      {
        id: 6,
        name: "Herb 6",
        name_scientific: "ScientificName6",
        description: "Description for Herb 6",
      },
      {
        id: 7,
        name: "Herb 7",
        name_scientific: "ScientificName7",
        description: "Description for Herb 7",
      },
      {
        id: 8,
        name: "Herb 8",
        name_scientific: "ScientificName8",
        description: "Description for Herb 8",
      },
      {
        id: 9,
        name: "Herb 9",
        name_scientific: "ScientificName9",
        description: "Description for Herb 9",
      },
      {
        id: 10,
        name: "Herb 10",
        name_scientific: "ScientificName10",
        description: "Description for Herb 10",
      },
      // Add more items as needed
    ];
    return allItems.slice(start, start + count);
  };

  const loadMore = async () => {
    if (visibleItems.length >= 10) {
      // Adjusted to match the length of allItems
      setHasMore(false);
      return;
    }

    const newItems = await fetchNewItems(visibleItems.length, 9);
    setVisibleItems((prevItems) => [...prevItems, ...newItems]);
  };

  return (
    <>
      {visibleItems.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
      {hasMore && (
        <button onClick={loadMore} className="mt-4 p-2 bg-blue-500 text-white">
          Load More
        </button>
      )}
    </>
  );
};

export default InfiniteScroll;
