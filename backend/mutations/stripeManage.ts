import { KeystoneContext } from '@keystone-6/core/types';

interface Arguments {
  variationId: string;
  userId: string;
  returnUrl: string;
}
import stripeConfig from '../lib/stripe';

const graphql = String.raw;

async function stripeManage(
  root: any,
  { returnUrl }: Arguments,
  context: KeystoneContext
) {
  const userId = context.session?.itemId;
  if (!userId) {
    console.log("No user signed in");
    return {error: "No user signed in"};
  };
  const user = await context.query.User.findOne({
    where: { id: userId },
    query: graphql`
            id
            stripeCustomerId
            `,
  });

  const portalSession = await stripeConfig.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: returnUrl,
  });
  return portalSession;
}
export default stripeManage;
