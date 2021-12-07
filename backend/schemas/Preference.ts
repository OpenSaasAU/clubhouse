import { list } from '@keystone-6/core';
import { text, relationship} from '@keystone-6/core/fields';
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