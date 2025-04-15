import React from "react";
import { marked } from "marked";
import styles from "./HerbDecoration.module.css";
import type { HerbsRecord } from "../types/staticql-types";

interface Props {
  herb: HerbsRecord;
}

const HerbDecoration: React.FC<Props> = ({ herb }) => {
  return (
    <div className={styles.herbDecoration}>
      <div />

      <div className={styles.herbDecorationContent}>
        <div>
          <h2>{herb.name}の概要</h2>
          <p>{herb.overview}</p>
        </div>
        <img src="/ui/001.png" alt="aaa" width="400" height="300" />
        <div>
          <h2>{herb.name}の期待される効果・効能</h2>
          <p
            dangerouslySetInnerHTML={{ __html: marked.parse(herb.efficacy) }}
          />
        </div>
      </div>

      <div />
    </div>
  );
};

export default HerbDecoration;
