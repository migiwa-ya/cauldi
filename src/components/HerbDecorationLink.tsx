import React from "react";
import type { Herb } from "../types/herbs";
import styles from "./HerbDecoration.module.css";
import classNames from "classnames";

interface Props {
  herb: Herb;
}

const HerbDecorationLink: React.FC<Props> = ({ herb }) => {
  return (
    <a
      href={`/herbs/${herb.slug}`}
      className={classNames(styles.herbDecoration, styles.herbDecorationLink)}
    >
      <div />

      <div>
        <div>
          <span>{herb.nameScientific}</span>
          <p className="clamp-3">{herb.efficacy}</p>
        </div>
        <img src="/ui/001.png" alt="aaa" width="400" height="300" />
      </div>

      <div />
    </a>
  );
};

export default HerbDecorationLink;
