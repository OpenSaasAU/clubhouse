import { list } from '@keystone-next/keystone/schema';
import { text, relationship} from '@keystone-next/fields';
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