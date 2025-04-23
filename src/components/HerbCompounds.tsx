import React from "react";
import type { CompoundsRecord } from "../types/staticql-types";
import styles from "./HerbCompounds.module.css";

interface HerbCompoundsProps {
  compounds: CompoundsRecord[];
}

const HerbCompounds: React.FC<HerbCompoundsProps> = ({ compounds }) => {
  return (
    <table className={`${styles.compounds} table`}>
      <thead>
        <tr>
          <th>成分名</th>
          <th>特性</th>
        </tr>
      </thead>
      <tbody>
        {compounds.map((compound, index) => (
          <tr key={index}>
            <td>{compound.name}</td>
            <td>{compound.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HerbCompounds;
