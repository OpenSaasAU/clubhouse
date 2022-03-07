import { KeystoneContext } from '@keystone-6/core/types';
//import { v4 as uuidv4 } from 'uuid';
import cuid from 'cuid';


const graphql = String.raw;
interface Arguments {
    email: string,
    name: string,
    password: string,
    preferredName: string,
    phone: string,
    phoneType: 'FIXED' | 'MOBILE',
    birthYear: number,
    contact: boolean,
    createUser: boolean,
    suburb: string
}


async function customSignup(
    root: any,
    { email, name, password, preferredName, phone, phoneType, birthYear, contact, createUser, suburb }: Arguments,
    context: KeystoneContext
) {
    const sudo = context.sudo();

    console.log('Start');

    let userId = context.session?.itemId;
    if (userId) {
        const user = await sudo.query.User.findOne({
            where: { id: userId },
            query: graphql`
                id
                person {
                    id
                    name
                    email
                }
            `
        });
        sudo.exitSudo();
        return user.person;
    } else {
        if (!context.startSession) {
            sudo.exitSudo();
            throw new Error('No session implementation available on context');
        }
        console.log('No Signed in User');

        // No signed in user
        // 1. Check if the email is used
        const existingPerson = await sudo.query.Person.findMany({
            where: { email: { equals: email } },
            query: graphql`
                    id
                    email
                    phone
                    birthYear
                    user {
                        id
                        email
                    }
            `
        });
        console.log('ExistingUser: ', JSON.stringify(existingPerson));

        if (existingPerson[0]?.user?.email === email) {
            sudo.exitSudo();
            throw new Error('Sorry! There is already and account with that email! Try resetting your password instead')
        } else if (existingPerson[0]?.phone === phone && existingPerson[0]?.birthYear === birthYear) {
            // Confident the user is the same...
            if (!createUser) {
                const sessionToken = await context.startSession({ listKey: 'User', itemId: existingPerson[0].user.id });
                sudo.exitSudo();
                return { sessionToken, id: existingPerson[0].id };
            } else {
                //update the user email and password
                await sudo.query.User.updateOne({
                    where: { id: existingPerson[0].user.id }, data: { email: email, password: password }
                })
                const sessionToken = await context.startSession({ listKey: 'User', itemId: existingPerson[0].user.id });
                sudo.exitSudo();
                return { sessionToken, id: existingPerson[0].id };
            }

        } else if (!existingPerson[0]) {
            // No person and don't want to create a new one so Create user and person with GUID email
            if (!createUser) {
                const newGuid = cuid();
                const guidEmail = `${newGuid}@noemail`
                const createUser = await sudo.query.User.createOne({
                    data: {
                        name: name,
                        email: guidEmail,
                        password: cuid(),
                        subjectId: cuid(),
                        person: {
                            create: {
                                name: name,
                                email: email,
                                preferredName: preferredName || '',
                                phone: phone,
                                phoneType: phoneType || 'MOBILE',
                                birthYear: birthYear,
                                contact: contact || false,
                                suburb: suburb
                            }
                        }
                    },
                    query: graphql`
                id
                person {
                    id
                }
                `
                })
                userId = createUser.id;
                const sessionToken = await context.startSession({ listKey: 'User', itemId: userId });
                sudo.exitSudo();
                console.log("return", sessionToken, createUser);

                return { sessionToken, id: createUser.person.id };
            } else {
                //create the user with the real email
                const createUser = await sudo.query.User.createOne({
                    data: {
                        name: name,
                        email: email,
                        password: password,
                        subjectId: cuid(),
                        person: {
                            create: {
                                name: name,
                                email: email,
                                preferredName: preferredName || '',
                                phone: phone,
                                phoneType: phoneType || 'MOBILE',
                                birthYear: birthYear,
                                contact: contact || false,
                                suburb: suburb
                            }
                        }
                    },
                    query: graphql`
                                    id
                                    person {
                                        id
                                    }
                                `
                })
                userId = createUser.id;
                const sessionToken = await context.startSession({ listKey: 'User', itemId: userId });
                sudo.exitSudo();
                return { sessionToken, id: createUser.person.id };
            }
        } else {
            sudo.exitSudo();
            throw new Error('Oops, you might have done something we didnt account for...')
        }
    }

}

export default customSignup;