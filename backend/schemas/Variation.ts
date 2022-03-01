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

export const Variation = list({
  access: {
    operation: {
      create: permissions.canManageProducts,
      delete: permissions.canManageProducts,
      update: permissions.canManageProducts,
    },
    filter: {
      update: rules.canManageProducts,
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    type: relationship({
      ref: "Subscription.variations",
      many: false,
    }),
    memberships: relationship({
      ref: "Membership.variation",
      many: true,
    }),
    cost: integer({
      validation: {
        isRequired: true,
      },
    }),
    chargeInterval: select({
      options: [
        { value: "day", label: "Day" },
        { value: "week", label: "Week" },
        { value: "month", label: "Month" },
        { value: "year", label: "Year" },
      ],
      validation: {
        isRequired: true,
      },
    }),
    chargeIntervalCount: integer({
      validation: {
        isRequired: true,
      },
    }),
    tatalCount: integer(),
    stripePrice: text(),
  },
});
