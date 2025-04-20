import React from "react";
import styles from "./HerbDecoration.module.css";
import classNames from "classnames";
import type { HerbsRecord } from "../types/staticql-types";

interface Props {
  herb: HerbsRecord;
}

const HerbDecorationLink: React.FC<Props> = ({ herb }) => {
  return (
    <a
      href={`/herbs/${herb.slug}/`}
      className={classNames(styles.herbDecoration, styles.herbDecorationLink)}
    >
      <div />

      <div>
        <div>
          <span>{herb.nameScientific}</span>
          <p className="clamp-3">{herb.efficacy}</p>
        </div>
        <img
          src={`/images/herbs/${herb.slug}/thumbnail.webp`}
          alt={herb.nameScientific}
          width="400"
          height="300"
        />
      </div>

      <div />
    </a>
  );
};

export default HerbDecorationLink;
