import React from "react";
import type { Herb } from "../types/herbs";
import { marked } from "marked";
import style from "./HerbDecoration.module.css";

interface Props {
  herb: Herb;
}

const HerbDecoration: React.FC<Props> = ({ herb }) => {
  return (
    <div className={`${style.herbDecoration} mb-3`}>
      <div className="border-b border-dashed"></div>
      <div className="flex items-center my-2 max-lg:flex-col">
        <div className="self-stretch border-r w-full font-serif my-[3px] p-6 max-lg:border-0! max-lg:border-b-1!">
          <h2 className="block mb-1 text-center font-bold">
            {herb.name}の概要
          </h2>
          <p>{herb.overview}</p>
        </div>
        <img
          src="/ui/001.png"
          alt="aaa"
          width="400"
          height="300"
          className="w-full my-[3px] p-6 object-contain h-[300px]"
        />
        <div className="self-stretch border-l w-full font-serif my-[3px] p-6 max-lg:border-0! max-lg:border-t-1!">
          <h2 className="block mb-1 text-center font-bold">
            {herb.name}の期待される効果・効能
          </h2>
          <p
            dangerouslySetInnerHTML={{ __html: marked.parse(herb.efficacy) }}
          />
        </div>
      </div>
      <div className="border-t border-dashed"></div>
    </div>
  );
};

export default HerbDecoration;
