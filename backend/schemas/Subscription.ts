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

export const Subscription = list({
  access: {
    operation: {
      create: permissions.canManageProducts,
      delete: permissions.canManageProducts,
    },
    filter: {
      update: rules.canManageProducts,
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
    stripeProduct: text(),
  },
});
