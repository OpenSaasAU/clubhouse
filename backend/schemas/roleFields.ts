import { checkbox } from '@keystone-next/fields';

export const permissionFields = {
  canManageClubs: checkbox({
    defaultValue: false,
    label: 'User can see and manage add Clubs',
  }),
  canSeeOtherUsers: checkbox({
    defaultValue: false,
    label: 'User can query all other users',
  }),
  canManageUsers: checkbox({
    defaultValue: false,
    label: 'User can Edit all other users',
  }),
  canManageRoles: checkbox({
    defaultValue: false,
    label: 'User can CRUD roles',
  }),
  canManageMemberships: checkbox({
    defaultValue: false,
    label: 'User can see and manage all memberships',
  }),
  canManagePosts: checkbox({
    defaultValue: false,
    label: 'User can see and manage All Posts',
  }),
};

export type Permission = keyof typeof permissionFields;

export const permissionsList: Permission[] = Object.keys(
  permissionFields
) as Permission[];
