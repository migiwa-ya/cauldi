import React from "react";
import ListItem from "./ListItem";
import type { ListItemData } from "./ListItem";

interface ListProps {
  items: ListItemData[];
}

const List: React.FC<ListProps> = ({ items }) => {
  const sortedItems = items.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <>
      {sortedItems.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </>
  );
};

export default List;
