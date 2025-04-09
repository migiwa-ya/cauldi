import { defineContentDB } from "@migiwa-ya/staticql";
import { z } from "zod";

export default defineContentDB({
  sources: {
    herbs: {
      path: "src/content/herbs/*.md",
      type: "markdown",
      schema: z.array(
        z.object({
          slug: z.string(),
          name: z.string(),
          tagSlugs: z.array(z.string()),
          content: z.string(),
          updatedAt: z.date(),
          createdAt: z.date(),
        })
      ),
      relations: {
        tags: {
          to: "tags",
          localKey: "tagSlugs",
          foreignKey: "slug",
        },
        herbState: {
          to: "herbStates",
          localKey: "herbStateSlug",
          foreignKey: "slug",
        },
        reports: {
          to: "reports",
          localKey: "slug",
          foreignKey: "combinedHerbs.slug",
        },
      },
      index: [
        "name",
        "herbState.name",
        "tags.slug",
        "tags.name",
        "reports.slug",
        "updatedAt",
      ],
    },

    herbStates: {
      path: "src/content/herbStates.yaml",
      type: "yaml",
      schema: z.array(
        z.object({
          slug: z.string(),
          name: z.string(),
        })
      ),
    },

    reports: {
      path: "src/content/reports/**/*.md",
      type: "markdown",
      schema: z.array(
        z.object({
          slug: z.string(),
          reportGroupSlug: z.string(),
          summary: z.string(),
          ingredients: z.array(z.string()),
          recipe: z.array(z.string()),
          content: z.string(),
          combinedHerbs: z.array(
            z.object({
              slug: z.string(),
              herbStateSlug: z.string(),
              herbPartSlug: z.string(),
              description: z.string(),
            })
          ),
          updatedAt: z.date(),
          createdAt: z.date(),
        })
      ),
      relations: {
        herbs: {
          to: "herbs",
          localKey: "combinedHerbs.slug",
          foreignKey: "slug",
        },
        reportGroups: {
          to: "reportGroups",
          localKey: "reportGroupSlug",
          foreignKey: "slug",
        },
        usageMethods: {
          to: "usageMethods",
          localKey: "usageMethodSlug",
          foreignKey: "slug",
        },
      },
      index: [
        "reportGroupSlug",
        "processSlug",
        "combinedHerbs.slug",
        "herbs.name",
        "updatedAt",
      ],
    },

    reportGroups: {
      path: "src/content/reportGroups.yaml",
      type: "yaml",
      schema: z.array(
        z.object({
          slug: z.string(),
          herbSlugs: z.array(z.string()),
          processSlug: z.string(),
        })
      ),
      relations: {
        processes: {
          to: "processes",
          localKey: "processSlug",
          foreignKey: "slug",
        },
      },
      index: ["herbSlugs", "processSlug", "processes.name"],
    },

    tags: {
      path: "src/content/tags.yaml",
      type: "yaml",
      schema: z.array(
        z.object({
          slug: z.string(),
          name: z.string(),
        })
      ),
    },

    processes: {
      path: "src/content/processes.yaml",
      type: "yaml",
      schema: z.array(
        z.object({
          slug: z.string(),
          name: z.string(),
        })
      ),
    },

    usageMethods: {
      path: "src/content/usageMethods.yaml",
      type: "yaml",
      schema: z.array(
        z.object({
          slug: z.string(),
          name: z.string(),
        })
      ),
    },
  },
});
