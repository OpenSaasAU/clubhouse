import { integer, select, text, checkbox, relationship, timestamp } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { rules, isSignedIn, permissions } from '../access';

export const MembershipSubType = list({
    access: {
        operation: {
            create: permissions.canManageEvents,
            delete: permissions.canManageEvents,
            update: permissions.canManageEvents,
        },
        filter: {
            update: rules.canManageEvents,
        }
    },
    fields: {
        name: text({ validation: { isRequired: true } }),
        type: relationship({
            ref: 'MembershipType.subTypes',
            many: false,
        }),
        cost: integer(),
    }
});