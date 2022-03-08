import {
  integer,
  select,
  text,
  checkbox,
  relationship,
  timestamp,
} from "@keystone-6/core/fields";
import { list } from "@keystone-6/core";
import { rules, isSignedIn, permissions } from "../access";
import { document } from "@keystone-6/fields-document";
import stripeConfig from "../lib/stripe";

export const Subscription = list({
  hooks: {
    resolveInput: async ({ resolvedData, item }) => {
      // If the subscription is being created and no stripeProductId is provided, create a new stripe product
      if (!resolvedData.stripeProductId && !item?.stripeProductId) {
        const product = await stripeConfig.products.create({
          name: item?.name || resolvedData.name,
        });
        resolvedData.stripeProductId = product.id;
      }
      return resolvedData;
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    description: text({ validation: { isRequired: true } }),
    club: relationship({
      ref: "Club.subscriptions",
      many: false,
    }),
    variations: relationship({
      ref: "Variation.subscription",
      many: true,
    }),
    fromEmail: text({
      validation: {
        isRequired: true,
      },
    }),
    emailTemplate: text({
      validation: {
        isRequired: true,
      },
    }),
    slug: text({
      isIndexed: "unique",
      validation: { isRequired: true },
      isFilterable: true,
    }),
    autoRenew: checkbox({ defaultValue: false }),
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
    stripeProductId: text({
      isIndexed: "unique",
    }),
  },
});
