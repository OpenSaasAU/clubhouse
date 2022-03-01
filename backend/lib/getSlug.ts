
import { KeystoneContext } from '@keystone-6/core/types';


export default async function getSlug(item: any, context: KeystoneContext) {

    let slug = item.name.replace(' ', '-');
    slug = slug.toLowerCase();
    slug = `${slug}-${item.id}`
    return slug;
}