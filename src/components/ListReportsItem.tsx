import React from "react";
import { formatDate } from "../utils/date";
import styles from "./ListItem.module.css";

export interface ListItemData {
  key: string;
  displayName: string;
  link: string;
  content: string;
  updatedAt: Date;
}

const ListReportsItem: React.FC<{ item: ListItemData }> = ({ item }) => {
  const link = item.link;
  return (
    <a href={link} className={styles.card}>
      <div className={styles.date}>
        <time dateTime={formatDate(item.updatedAt)}>
          <span>{formatDate(item.updatedAt, "m")}</span>
          <span>{formatDate(item.updatedAt, "d")}</span>
        </time>
      </div>
      <h2>{item.displayName}</h2>
      <img src="/ui/001.png" alt={item.displayName} width="400" height="300" />
      <strong>基本情報</strong>
      <p className="clamp-3">{item.content}</p>
    </a>
  );
};

export default ListReportsItem;
