import { list } from '@keystone-next/keystone';
import { text, relationship} from '@keystone-next/keystone/fields';
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