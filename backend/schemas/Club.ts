import { list } from '@keystone-next/keystone';
import { text, relationship, select } from '@keystone-next/keystone/fields';
import { document } from '@keystone-next/fields-document';

export const Club = list({
    fields: {
      name: text(),
      channels: relationship({
        ref: 'Channel.club',
        many: true,
      }),
      memberships: relationship({
        ref: 'Membership.club',
        many: true,
      }),
      status: select({
        options: [
          { label: 'Published', value: 'published' },
          { label: 'Draft', value: 'draft' },
        ],
        ui: {
          displayMode: 'segmented-control',
        },
      }),
      content: document({
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
    },
  });