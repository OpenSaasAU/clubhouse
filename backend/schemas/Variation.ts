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
    afterOperation: async ({ listKey, operation, resolvedData, context }) => {
      // Update Stripe Price if the variation is being updated
      if (operation === "update") {
        const variation = await context.query.Variation.findOne({
          where: { id: listKey },
          query: `
                            id
                            stripePriceId
                            status
                            `,
        });
        const active = variation.status === 'active' ? true : false;
        await stripeConfig.prices.update(
          variation.stripePriceId, {
          active
        });
      }
    },
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
        const active = resolvedData.status === 'active' || item?.active === 'active' ? true : false;
        const stripeProductId = subscription.stripeProductId;
        const unitPriceDollars = resolvedData.price || item?.price;
        const unitPriceCents = unitPriceDollars * 100;
        const price = await stripeConfig.prices.create({
          product: stripeProductId,
          active: active,
          currency: "aud",
          unit_amount: unitPriceCents,
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
    validateInput: async ({ resolvedData, addValidationError, context, item }) => {
      const subscription = await context.query.Subscription.findOne({
        where: { id: resolvedData.subscription?.connect?.id || item?.subscriptionId},
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
      update: rules.canManageSubscriptions,
      query: rules.canReadProducts
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    subscription: relationship({
      ref: "Subscription.variations",
      many: false,
    }),
    status: select({
      options: [
        { value: "active", label: "Active"},
        { value: "inactive", label: "Inactive"} ],
      defaultValue: "active",
    }),
    memberships: relationship({
      ref: "Membership.variation",
      many: true,
    }),
    price: integer({
      access: {
        update: () => false,
      },
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
      access: {
        update: () => false,
      },
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
      access: {
        update: () => false,
      },
      validation: {
        isRequired: true,
      },
    }),
    totalCount: integer(),
    stripePriceId: text({
      access: {
        update: () => false,
      },
      isIndexed: "unique",
    }),
  },
});
