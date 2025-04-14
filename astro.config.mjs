// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import db from "./staticql.config.ts";

// https://astro.build/config
export default defineConfig({
  vite: {},
  site: "http://localhost:4321",
  // site: "https://cauldi.com",
  experimental: {
    svg: true,
  },
  integrations: [
    react(),
    sitemap({
      async serialize(item) {
        // ハーブ詳細
        if (/herbs\/.+/.test(item.url)) {
          const url = new URL(item.url);
          const segments = url.pathname.split("/").filter(Boolean);
          const slug = segments[segments.length - 1];
          const herb = await db.from("herbs").where("slug", "eq", slug).exec();
          item.lastmod = herb[0].updatedAt;
        }

        // ハーブ一覧
        if (/herbs\/$/.test(item.url)) {
          const herb = (await db.from("herbs").exec()).sort(
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
          const reports = await db
            .from("reports")
            .where("reportGroupSlug", "eq", slug)
            .exec();
          const sortedReport = reports.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          item.lastmod = sortedReport[0].updatedAt;
        }

        // レポート一覧
        if (/reports\/$/.test(item.url)) {
          const reports = (await db.from("reports").exec()).sort(
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
            await db.from("herbs").where("tagSlugs", "contains", slug).exec()
          ).sort(
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
