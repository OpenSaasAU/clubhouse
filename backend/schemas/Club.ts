import { list } from "@keystone-6/core";
import { text, relationship, select } from "@keystone-6/core/fields";
import { document } from "@keystone-6/fields-document";

export const Club = list({
  fields: {
    name: text(),
    subscriptions: relationship({
      ref: "Subscription.club",
      many: true,
    }),
    posts: relationship({
      ref: "Post.club",
      many: true,
    }),
    status: select({
      options: [
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" },
      ],
      ui: {
        displayMode: "segmented-control",
      },
    }),
    slug: text({
      isIndexed: "unique",
      validation: { isRequired: true },
      isFilterable: true,
    }),
    description: text(),
    about: document({
      formatting: true,
      layouts: [
        [1, 1],
        [1, 1, 1],
        [2, 1],
        [1, 2],
        [1, 2, 1],
      ],
      links: true,
      dividers: true,
    }),
  },
});
