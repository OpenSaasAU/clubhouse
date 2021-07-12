import { Preference } from './Preference';
import { Membership } from './Membership';
import { Club } from './Club';
import { Channel } from './Channel';
import { Tag } from './Tag';
import { Post } from './Post';
import { User } from './User';
import { Role } from './Role';
import { createSchema } from '@keystone-next/keystone/schema';

export const lists = createSchema({
    Channel,
    Club,
    Post,
    Preference,
    Membership,
    Role,
    Tag,
    User,
})