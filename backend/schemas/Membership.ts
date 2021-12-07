import { list } from '@keystone-6/core';
import { text, relationship} from '@keystone-6/core/fields';
import { permissions } from '../access';
import { membershipFields } from './membershipFields';

export const Membership = list({
    fields: {
      name: text(),
      description: text(),
      ...membershipFields,
      club: relationship({
        ref: 'Club.memberships',
        many: true,
      }),
      users: relationship({
        ref: 'User.memberships',
        many: true,
      }),

    },
  });