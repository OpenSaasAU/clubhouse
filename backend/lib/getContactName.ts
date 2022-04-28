import { KeystoneContext } from '@keystone-6/core/types';


export default async function getContactName(item: any, context: KeystoneContext) {

    if (!item.userId) {
        return 'No Person Selected...'
    }

    const person = context.query.User.findOne({
        where: { id: item.userId },
        query: `
            name
        `
    })
        .then(data => {
            if (item.endDate) {
                const name = data.name;
                const correctDate = new Date(item.endDate);
                return name + ' --End Date-- ' + correctDate.toDateString();
            } else {
                return data.name;
            }
        })
        .catch(err => {
            throw new Error(err);
        })


    return person;
}