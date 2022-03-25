import { list } from '@keystone-6/core';
import { text, relationship, json, checkbox } from '@keystone-6/core/fields';
import stripeConfig from '../lib/stripe';

import { rules, isSignedIn, permissions } from "../access";


export const User = list({
  hooks: {
    resolveInput: async ({ resolvedData, item }) => {
      // If the User is being created and no stripeCutomerId is provided create the stripe customer
      console.log(resolvedData);

      if (!resolvedData.stripeCustomerId && !item?.stripeCustomerId) {
        const customer = await stripeConfig.customers.create({
          email: resolvedData.email || item?.email,
          name: resolvedData.name || item?.name,
          phone: resolvedData.phone || item?.phone,
        });
        resolvedData.stripeCustomerId = customer.id;
      }
      return resolvedData;
    },
  },
  access: {
    operation: {
      create: () => true,
      delete: permissions.canManageUsers,
    },
    filter: {
      update: rules.canManageUsers,
      query: rules.canManageUsers,
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    email: text({ validation: { isRequired: true }, isIndexed: true }),
    subjectId: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
    preferredName: text(),
    phone: text(),
    posts: relationship({ ref: 'Post.author', many: true }),
    isAdmin: checkbox({
      access: {
        update: permissions.canManageUsers,
        create: permissions.canManageUsers,
      },
      defaultValue: false,
      label: 'User can access admin portal',
    }),
    role: relationship({
      access: {
        update: permissions.canManageUsers,
        create: permissions.canManageUsers,
      },
      ref: 'Role.assignedTo',
      many: false,
    }),
    householdMembers: json({
      ui: {
        //views: require.resolve('../custom-views/household-members.tsx'),
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),
    stripeCustomerId: text({
      isIndexed: 'unique',
    }),
    memberships: relationship({
      ref: 'Membership.user',
      many: true,
    }),
  },
});
