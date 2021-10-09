import { list } from '@keystone-next/keystone';
import { text, relationship} from '@keystone-next/keystone/fields';
import { document } from '@keystone-next/fields-document';

export const Tag = list({
    ui: {
      isHidden: true,
    },
    fields: {
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
      post: relationship({
        ref: 'Post.comments',
        many: false,
      }),
      author: relationship({
        ref: 'User.comments',
        many: false
      })
    },
  });