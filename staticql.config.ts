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
          nameAliases: z.array(z.string()),
          nameScientific: z.string(),
          compoundSlugs: z.array(z.string()),
          tagSlugs: z.array(z.string()),
          overview: z.string(),
          efficacy: z.string(),
          wiki: z.string(),
          content: z.string(),
          updatedAt: z.date(),
          createdAt: z.date(),
        })
      ),
      relations: {
        compounds: {
          to: "compounds",
          localKey: "compoundSlugs",
          foreignKey: "slug",
          type: "hasMany",
        },
        tags: {
          to: "tags",
          localKey: "tagSlugs",
          foreignKey: "slug",
          type: "hasMany",
        },
        reports: {
          to: "reports",
          through: "reportGroups",
          sourceLocalKey: "slug",
          throughForeignKey: "combinedHerbs.slug",
          throughLocalKey: "slug",
          targetForeignKey: "reportGroupSlug",
          type: "hasManyThrough",
        },
      },
      index: ["name", "tagSlugs"],
      splitIndexByKey: true,
      meta: [
        "slug",
        "name",
        "overview",
        "herbState.name",
        "tags",
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
          flavor: z.object({
            bitterness: z.number(),
            astringency: z.number(),
            sweetness: z.number(),
            sourness: z.number(),
            spiciness: z.number(),
            umami: z.number(),
          }),
          content: z.string(),
          images: z.array(
            z.object({
              imageUrl: z.string(),
              caption: z.string(),
              sortOrder: z.number(),
            })
          ),
          updatedAt: z.date(),
          createdAt: z.date(),
        })
      ),
      relations: {
        reportGroup: {
          to: "reportGroups",
          localKey: "reportGroupSlug",
          foreignKey: "slug",
          type: "hasOne",
        },
        herbs: {
          to: "herbs",
          through: "reportGroups",
          sourceLocalKey: "reportGroupSlug",
          throughForeignKey: "slug",
          throughLocalKey: "combinedHerbs.slug",
          targetForeignKey: "slug",
          type: "hasManyThrough",
        },
        process: {
          to: "processes",
          through: "reportGroups",
          sourceLocalKey: "reportGroupSlug",
          throughForeignKey: "slug",
          throughLocalKey: "processSlug",
          targetForeignKey: "slug",
          type: "hasOneThrough",
        },
        usageMethod: {
          to: "usageMethods",
          localKey: "usageMethodSlug",
          foreignKey: "slug",
          type: "hasOne",
        },
      },
      index: ["slug", "reportGroupSlug"],
      meta: [
        "reportGroupSlug",
        "processSlug",
        "reportGroup.combinedHerbs.slug",
        "process.name",
        "herbs.name",
        "summary",
        "updatedAt",
      ],
    },

    reportGroups: {
      path: "src/content/reportGroups.yaml",
      type: "yaml",
      schema: z.array(
        z.object({
          slug: z.string(),
          description: z.string(),
          combinedHerbs: z.array(
            z.object({
              slug: z.string(),
              herbStateSlug: z.string(),
              herbPartSlug: z.string(),
            })
          ),
          processSlug: z.string(),
        })
      ),
      relations: {
        process: {
          to: "processes",
          localKey: "processSlug",
          foreignKey: "slug",
          type: "hasOne",
        },
        herbs: {
          to: "herbs",
          localKey: "combinedHerbs.slug",
          foreignKey: "slug",
          type: "hasMany",
        },
      },
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

    compounds: {
      path: "src/content/compounds.yaml",
      type: "yaml",
      schema: z.array(
        z.object({
          slug: z.string(),
          name: z.string(),
          description: z.string(),
        })
      ),
    },
  },
});
