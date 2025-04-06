import React from "react";
import type { HerbDescriptionSection } from "../types/herbs";

const ColumnUnit: React.FC<HerbDescriptionSection> = ({
  heading,
  subheading,
  text,
}) => {
  return (
    <>
      <div className="c-column-head">
        <span className="font-[Stoke]">{heading}</span>
        <h3 className="text-xs italic">{subheading}</h3>
      </div>
      <div className="c-column-body">{text}</div>
    </>
  );
};

export default ColumnUnit;
