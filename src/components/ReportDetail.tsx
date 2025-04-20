import React from "react";
import { formatDate } from "../utils/date";
import styles from "./ReportDetail.module.css";
import classNames from "classnames";
import type { ReportsRecord } from "../types/staticql-types";

interface ReportDetailProps {
  report: ReportsRecord;
}

const flavorMap = {
  bitterness: "苦味",
  sweetness: "甘味",
  sourness: "酸味",
  spiciness: "辛味",
  astringency: "渋味",
  umami: "旨味",
  aromaType: "香りの種類",
  aromaIntensity: "香りの強さ",
  aftertaste: "後味",
};

const ReportDetail: React.FC<ReportDetailProps> = ({ report }) => {
  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h2>
          {report.herbs?.map((herb) => herb.name).join("・")}の
          {report.process?.name}の{report.usageMethod?.name}
        </h2>
        <time dateTime={formatDate(report.updatedAt)}>
          {formatDate(report.updatedAt, "Y-m-d")}
        </time>
        <span>{report.slug.replaceAll("-", "")}</span>
      </header>

      <strong className={styles.reportLabel}>REPORT</strong>
      <section className={classNames(styles.gridLine, styles.reportContent)}>
        <dl className={styles.dataItem}>
          <dt>Herbs</dt>
          <dd>
            {report.herbs?.map((herb) => (
              <a href={`/herbs/${herb.slug}`}>{herb.name}</a>
            ))}
          </dd>
        </dl>
        <dl className={styles.dataItem}>
          <dt>用途</dt>
          <dd>{report.usageMethod?.name}</dd>
        </dl>
        <dl className={styles.dataItem}>
          <dt>構成要素</dt>
          <dd>{report.ingredients.join("・")}</dd>
        </dl>
        <dl className={styles.dataItem}>
          <dt>総合評価</dt>
          <dd>{report.summary}</dd>
        </dl>
      </section>

      <div className={styles.footer}>
        <section className={styles.footerSection}>
          <strong className={styles.noteTitle}>作り方</strong>
          <ul className={styles.note}>
            {report.recipe.map((r) => (
              <li>{r}</li>
            ))}
          </ul>

          <div className={styles.images}>
            {report.images.map((i) => (
              <img
                src={i.imageUrl}
                alt={i.caption}
                data-modal="true"
                data-img={i.imageUrl}
              />
            ))}
          </div>
        </section>
        <section className={styles.footerSection}>
          <strong className={styles.noteTitle}>感想</strong>
          <p className={styles.note}>{report.content}</p>
          <ul className={styles.flavorRating}>
            {(
              Object.entries(report.flavor) as [
                keyof typeof flavorMap,
                number
              ][]
            ).map(([key, value]) => (
              <li>
                <span>{flavorMap[key]}</span>
                <progress
                  className={styles.progress}
                  id="progress"
                  value={value}
                  max="10"
                ></progress>
                <span>{value}/10</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
};

export default ReportDetail;
