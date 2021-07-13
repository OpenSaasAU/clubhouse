import { list } from '@keystone-next/keystone/schema';
import { text, relationship} from '@keystone-next/fields';
import { preferenceFields } from './preferenceFields';

export const Preference = list({
    fields: {
      name: text(),
      user: relationship({
        ref: 'User.preferences',
        many: false,
      }),
      channel: relationship({
        ref: 'Channel',
        many: false,
      }),
      ...preferenceFields,
    },
  });