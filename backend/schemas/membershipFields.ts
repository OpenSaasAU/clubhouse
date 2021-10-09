import { checkbox } from '@keystone-next/keystone/fields';

export const membershipFields = {
  canManagePosts: checkbox({
    defaultValue: false,
    label: 'User can Create, update and approve all posts in this club',
  }),
  canSeeOtherUsers: checkbox({
    defaultValue: false,
    label: 'User can query other users in this club',
  }),
  canManageUsers: checkbox({
    defaultValue: false,
    label: 'User can add and remove other users from this club',
  }),
  canManageMemberships: checkbox({
    defaultValue: false,
    label: 'User can create and update memberships in this club',
  }),
  canManageChannels: checkbox({
    defaultValue: false,
    label: 'User can see and manage all channels in this club',
  }),
  canManageOrgs: checkbox({
    defaultValue: false,
    label: 'User can see and manage Organisations',
  }),
};

export type Permission = keyof typeof membershipFields;

export const permissionsList: Permission[] = Object.keys(
  membershipFields
) as Permission[];
