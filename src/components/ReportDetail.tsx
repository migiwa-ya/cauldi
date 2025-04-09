import React from "react";
import type { Report } from "../types/reports";
import { formatDate } from "../utils/date";
import style from "./ReportDetail.module.css";

interface ReportDetailProps {
  report: Report;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ report }) => {
  return (
    <article className="relative mt-4 bg-vintage-paper border border-vintage-ink outline-2 outline-vintage-ink outline-offset-2 rounded-md">
      <header className="flex gap-2 justify-between absolute right-2 -top-7 w-full line-clamp-1 text-nowrap text-xs">
        <h2 className="flex-1 pl-2">
          {report.herbs.map((herb) => herb.name).join("・")}の
          {report.process?.name}の{report.usageMethods[0].name}
        </h2>
        <time dateTime={formatDate(report.updatedAt)}>
          {formatDate(report.updatedAt, "Y-m-d")}
        </time>
        <span>{report.slug.replaceAll("-", "")}</span>
      </header>
      <strong className="block w-64 py-2 mt-6 mb-4 m-auto border-2 border-dashed border-vintage-ink text-vintage-ink text-[3rem] text-center">
        REPORT
      </strong>
      <section
        className={`${style.gridLine} leading-12 border-y-1 border-vintage-ink text-vintage-ink`}
      >
        <dl className="inline relative p-4 py-2 border-r">
          <dt className="inline absolute left-0 px-2 text-xs whitespace-nowrap">
            Herbs
          </dt>
          <dd className="inline">
            {report.herbs.map((herb) => (
              <a
                href={`/herbs/${herb.slug}`}
                className="text-link mr-2 last:mr-0 after:text-vintage-ink after:ml-2 after:content-['・'] last:after:content-none"
              >
                {herb.name}
              </a>
            ))}
          </dd>
        </dl>
        <dl className="inline relative p-4 py-2 border-r">
          <dt className="inline absolute left-0 px-2 text-xs whitespace-nowrap">
            用途
          </dt>
          <dd className="inline">{report.usageMethods[0].name}</dd>
        </dl>
        <dl className="inline relative p-4 py-2 border-r">
          <dt className="inline absolute left-0 px-2 text-xs whitespace-nowrap">
            構成要素
          </dt>
          <dd className="inline">{report.ingredients.join("・")}</dd>
        </dl>
        <dl className="inline relative p-4 py-2 border-r">
          <dt className="inline absolute left-0 px-2 text-xs whitespace-nowrap">
            総合評価
          </dt>
          <dd className="inline">{report.summary}</dd>
        </dl>
      </section>

      <div className="flex flex-col sm:flex-row mt-1 border-t-2 border-vintage-ink text-vintage-ink">
        <section className="relative w-full border-r-0 sm:border-r-2 border-vintage-ink px-6 pt-10 pb-6">
          <strong className="absolute top-2 left-2 text-sm">作り方</strong>
          <ul className={`${style.note} list-decimal list-inside`}>
            {report.recipe.map((r) => (
              <li>{r}</li>
            ))}
          </ul>
        </section>
        <section className="relative w-full px-6 pt-10 pb-6">
          <strong className="absolute top-2 left-2 text-sm">感想</strong>
          <p className={style.note}>{report.content}</p>
          <ul className="py-4">
            <li className="flex items-center justify-start gap-2 w-full font-bold whitespace-nowrap">
              <span>甘味</span>
              <progress
                className="w-full max-w-[150px] h-2"
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
