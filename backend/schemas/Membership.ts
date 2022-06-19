import {
  integer,
  select,
  text,
  relationship,
  timestamp,
  virtual,
} from '@keystone-6/core/fields';
import { list, graphql } from '@keystone-6/core';
import { rules, isSignedIn, permissions } from '../access';
import getContactName from '../lib/getContactName';
import sendEmail from '../lib/sendEmail';
import { preferenceFields } from './preferenceFields';

export const Membership = list({
  access: {
    operation: {
      create: () => true,
      // only people with the permission can delete themselves!
      // You can't delete yourself
      delete: permissions.canManageProducts,
    },
    filter: {
      update: rules.canManageProducts,
      query: rules.canManageProducts,
      delete: rules.canDeleteMembership,
    },
  },
  hooks: {
    afterOperation: async ({ listKey, operation, resolvedData, context }) => {
      const sudo = context.sudo();

      if (operation === 'create') {
        const user = await sudo.query.User.findOne({
          where: { id: resolvedData?.user?.connect?.id },
          query: `
                            id
                            preferredName
                            email`,
        });
        const variation = await sudo.query.Variation.findOne({
          where: { id: resolvedData?.variation?.connect?.id },
          query: `
                            id
                            name
                            subscription { 
                              fromEmail
                              emailTemplate
                            }`,
        });
        const data = {
          to: user.email,
          from: variation.subscription.fromEmail,
          templateId: variation.subscription.emailTemplate,
          dynamicTemplateData: {
            firstName: user.preferredName,
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
      ref: 'User.memberships',
      many: false,
    }),
    variation: relationship({
      ref: 'Variation.memberships',
      many: false,
    }),
    signupSessionId: text({
      validation: {
        isRequired: true,
      },
      isIndexed: 'unique',
    }),
    status: select({
      options: [
        { label: 'Pending', value: 'PENDING' },
        { label: 'Approved', value: 'APPROVED' },
        { label: 'Paid', value: 'PAID' },
        { label: 'Payment Failed', value: 'FAILED' },
        { label: 'Rejected', value: 'REJECTED' },
        { label: 'Cancelled', value: 'CANCELLED' },
        { label: 'Expired', value: 'EXPIRED' },
      ],
      defaultValue: 'PENDING',
    }),
    startDate: timestamp({
      defaultValue: { kind: 'now' },
    }),
    renewalDate: timestamp(),
    stripeSubscriptionId: text({
      validation: {
        isRequired: true,
      },
      isIndexed: 'unique',
    }),
    ...preferenceFields,
  },
});
