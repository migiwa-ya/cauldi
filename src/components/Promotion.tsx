import React from "react";
import style from "./Promortion.module.css";

const Promotion: React.FC = () => {
  return (
    <aside className={style.promotion}>
      <div>
        <img src="/002.png" alt="" />
        <img src="/002.png" alt="" />
        <img src="/002.png" alt="" />
        <img src="/002.png" alt="" />
      </div>
      <div>
        <strong>PR/Promotion</strong>
        <p>このPRは実際に購入・使用した商品を元に作成しています。</p>
        <p>
          また、当サイトは Amazon アソシエイトプログラムまたは iHerb
          アフィリエイトなどに参加しています。
        </p>
      </div>
    </aside>
  );
};

export default Promotion;
