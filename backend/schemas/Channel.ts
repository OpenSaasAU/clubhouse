import { list } from '@keystone-next/keystone/schema';
import { text, relationship, select } from '@keystone-next/fields';
import { document } from '@keystone-next/fields-document';

export const Channel = list({
    fields: {
      name: text(),
      description: text(),
      posts: relationship({
        ref: 'Post.channel',
        many: true,
      }),
      club: relationship({
        ref: 'Club.channels',
        many: false,
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