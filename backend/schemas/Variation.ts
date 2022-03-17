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

export const Variation = list({
  hooks: {
    resolveInput: async ({ resolvedData, item, context }) => {
      // If the User is being created and no stripeCutomerId is provided create the stripe customer
      if (!resolvedData.stripePriceId && !item?.stripePriceId) {
        console.log(resolvedData);
        const subscription = await context.query.Subscription.findOne({
          where: { id: resolvedData.subscription.connect.id },
          query: `
                id
                stripeProductId`,
        });
        const stripeProductId = subscription.stripeProductId;
        const price = await stripeConfig.prices.create({
          product: stripeProductId,
          currency: "aud",
          unit_amount: resolvedData.price || item?.price,
          recurring: {
            interval: resolvedData.chargeInterval || item?.chargeInterval,
            interval_count:
              resolvedData.chargeIntervalCount || item?.chargeIntervalCount,
            usage_type: "licensed",
          },
        });
        resolvedData.stripePriceId = price.id;
      }
      return resolvedData;
    },
    validateInput: async ({ resolvedData, addValidationError, context }) => {
      const subscription = await context.query.Subscription.findOne({
        where: { id: resolvedData.subscription.connect.id },
        query: `
              id
              stripeProductId`,
      });
      if (!subscription || !subscription.stripeProductId) {
        // We call addValidationError to indicate an invalid value.
        addValidationError(
          "You need to connect a subscription to a variation that subscription must have a Stripe product ID"
        );
      }
    },
  },
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
    subscription: relationship({
      ref: "Subscription.variations",
      many: false,
    }),
    memberships: relationship({
      ref: "Membership.variation",
      many: true,
    }),
    price: integer({
      validation: {
        isRequired: true,
      },
    }),    
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
    totalCount: integer(),
    stripePriceId: text({
      isIndexed: "unique",
    }),
  },
});
