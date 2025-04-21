import React from "react";
import { formatDate } from "../utils/date";
import styles from "./ListItem.module.css";
import { toBotanicalName } from "../utils/herbs";

export interface ListItemData {
  key: string;
  displayName: string;
  link: string;
  images: {
    path: string;
    label: string;
  }[];
  content: string;
  updatedAt: Date | string;
}

const ListItem: React.FC<{ item: ListItemData }> = ({ item }) => {
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
      <div className={styles.content}>
        {item.images.map(({ path, label }) => (
          <figure key={path}>
            <img
              src={path}
              alt={label}
              width="512"
              height="768"
              loading="lazy"
            />
            <figcaption>{label}</figcaption>
          </figure>
        ))}
      </div>

      <strong>基本情報</strong>
      <p className="clamp-3">{item.content}</p>
    </a>
  );
};

export default ListItem;
