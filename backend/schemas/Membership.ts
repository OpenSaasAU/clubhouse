import {
  integer,
  select,
  text,
  relationship,
  timestamp,
  virtual,
} from "@keystone-6/core/fields";
import { list, graphql } from "@keystone-6/core";
import { rules, isSignedIn, permissions } from "../access";
import getContactName from "../lib/getContactName";
import sendEmail from "../lib/sendEmail";
import { preferenceFields } from "./preferenceFields";

export const Membership = list({
  access: {
    operation: {
      create: () => true,
      // only people with the permission can delete themselves!
      // You can't delete yourself
      delete: permissions.canManageUsers,
    },
    filter: {
      query: rules.canOrder,
      update: rules.canManageUsers,
    },
  },
  hooks: {
    afterOperation: async ({ listKey, operation, resolvedData, context }) => {
      const sudo = context.sudo();

      if (operation === "create") {
        const person = await sudo.query.User.findOne({
          where: { id: resolvedData?.user?.connect?.id },
          query: `
                            id
                            preferredName
                            email`,
        });
        const membershipType = await sudo.query.MembershipType.findOne({
          where: { id: resolvedData?.membershipType?.connect?.id },
          query: `
                            id
                            name
                            fromEmail
                            emailTemplate`,
        });
        const data = {
          to: person.email,
          from: membershipType.fromEmail,
          templateId: membershipType.emailTemplate,
          dynamicTemplateData: {
            firstName: person.preferredName,
          },
        };
        sendEmail(data);
      }
    },
  },
  fields: {
    name: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve(item, args, context, info) {
          const name = getContactName(item, context);
          return name;
        },
      }),
    }),
    user: relationship({
      ref: "User.memberships",
      many: false,
    }),
    variation: relationship({
      ref: "Variation.memberships",
      many: false,
    }),
    status: select({
      options: [
        { label: "Pending", value: "PENDING" },
        { label: "Approved", value: "APPROVED" },
        { label: "Paid", value: "PAID" },
        { label: "Rejected", value: "REJECTED" },
        { label: "Cancelled", value: "CANCELLED" },
        { label: "Expired", value: "EXPIRED" },
      ],
      defaultValue: "PENDING",
    }),
    startDate: timestamp({
      defaultValue: { kind: "now" },
    }),
    renewalDate: timestamp(),
    stripeSubscriptionId: text(),
    ...preferenceFields,
  },
});
