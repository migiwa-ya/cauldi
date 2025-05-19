// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineStaticQL, type StaticQLConfig } from "staticql";
import { FsRepository } from "staticql/repo/fs";
import config from "./public/staticql.config.json";
import type { HerbsRecord, ReportsRecord } from "./src/types/staticql-types";

const staticql = defineStaticQL(config as StaticQLConfig)({
  repository: new FsRepository("public"),
});

// https://astro.build/config
export default defineConfig({
  vite: {},
  site: "https://cauldi.com",
  integrations: [
    react(),
    sitemap({
      async serialize(item) {
        // ハーブ詳細
        if (/herbs\/.+/.test(item.url)) {
          const url = new URL(item.url);
          const segments = url.pathname.split("/").filter(Boolean);
          const slug = segments[segments.length - 1];
          const herb = await staticql
            .from<HerbsRecord>("herbs")
            .where("slug", "eq", slug)
            .exec();
          item.lastmod = herb.data[0].updatedAt;
        }

        // ハーブ一覧
        if (/herbs\/$/.test(item.url)) {
          const herb = (
            await staticql.from<HerbsRecord>("herbs").exec()
          ).data.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          item.lastmod = herb[0].updatedAt;
        }

        // レポート詳細
        if (/reports\/.+/.test(item.url)) {
          const url = new URL(item.url);
          const segments = url.pathname.split("/").filter(Boolean);
          const slug = segments[segments.length - 1];
          const reports = await staticql
            .from<ReportsRecord>("reports")
            .where("reportGroupSlug", "eq", slug)
            .exec();
          const sortedReport = reports.data.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          item.lastmod = sortedReport[0].updatedAt;
        }

        // レポート一覧
        if (/reports\/$/.test(item.url)) {
          const reports = (
            await staticql.from<ReportsRecord>("reports").exec()
          ).data.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          item.lastmod = reports[0].updatedAt;
        }

        // ハーブ一覧（タグ検索）
        if (/tags\/.+/.test(item.url)) {
          const url = new URL(item.url);
          const segments = url.pathname.split("/").filter(Boolean);
          const slug = segments[segments.length - 1];
          const herb = (
            await staticql
              .from<HerbsRecord>("herbs")
              .where("tagSlugs", "eq", slug)
              .exec()
          ).data.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          item.lastmod = herb[0].updatedAt;
        }

        return item;
      },
    }),
  ],
});
