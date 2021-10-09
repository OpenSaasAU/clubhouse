import { list } from '@keystone-next/keystone';
import { text, relationship} from '@keystone-next/keystone/fields';
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