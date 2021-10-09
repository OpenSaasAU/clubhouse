import { relationship, text } from '@keystone-next/keystone/fields';
import { list } from '@keystone-next/keystone';
import { permissions } from '../access';
import { permissionFields } from './roleFields';


export const Role = list({
    fields: {
      name: text({ validation: { isRequired: true }}),
      ...permissionFields,
      assignedTo: relationship({
        ref: 'User.role',
        many: true,
        ui: {
          itemView: { fieldMode: 'read' },
        },
      }),
    },
  });