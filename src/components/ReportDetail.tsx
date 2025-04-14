import React from "react";
import type { Report } from "../types/reports";
import { formatDate } from "../utils/date";
import styles from "./ReportDetail.module.css";
import classNames from "classnames";

interface ReportDetailProps {
  report: Report;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ report }) => {
  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h2>
          {report.herbs.map((herb) => herb.name).join("・")}の
          {report.process?.name}の{report.usageMethods[0].name}
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
            {report.herbs.map((herb) => (
              <a href={`/herbs/${herb.slug}`}>{herb.name}</a>
            ))}
          </dd>
        </dl>
        <dl className={styles.dataItem}>
          <dt>用途</dt>
          <dd>{report.usageMethods[0].name}</dd>
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
        </section>
        <section className={styles.footerSection}>
          <strong className={styles.noteTitle}>感想</strong>
          <p className={styles.note}>{report.content}</p>
          <ul className={styles.flavorRating}>
            <li>
              <span>甘味</span>
              <progress
                className={styles.progress}
                id="progress"
                value="3"
                max="10"
              ></progress>
              <span>3/10</span>
            </li>
          </ul>
        </section>
      </div>
    </article>
  );
};

export default ReportDetail;
