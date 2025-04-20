import React from "react";
import styles from "./ReportLinks.module.css";
import { formatDate } from "../utils/date";
import type { ReportsRecord } from "../types/staticql-types";

interface Props {
  reports: ReportsRecord[];
}

const HerbDecoration: React.FC<Props> = ({ reports }) => {
  return (
    <aside className={styles.reportLinks}>
      {reports.map((report) => (
        <a
          href={`/reports/${report.reportGroupSlug}`}
          className={styles.reportLinkCard}
        >
          <div>
            <div>
              <time dateTime={formatDate(report.updatedAt)}>
                {formatDate(report.updatedAt, "Y/m/d")}
              </time>
              <p className="clamp-1">({report.ingredients?.join("・")})</p>
            </div>
            <div>
              <p>{report.process?.name}</p>
              <p>{report.summary}</p>
            </div>
          </div>
          <img src={`/images/herbs/${report.reportGroup?.combinedHerbs![0].slug}/thumbnail.webp`} alt="" />
        </a>
      ))}
    </aside>
  );
};

export default HerbDecoration;
