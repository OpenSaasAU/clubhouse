import { KeystoneContext } from "@keystone-6/core/types";
import cuid from "cuid";

interface Arguments {
  variationId: string;
  userId: string;
  returnUrl: string;
}
import { stripeSession } from "../lib/stripe";

const graphql = String.raw;

async function membershipSignup(
  root: any,
  { variationId, userId, returnUrl }: Arguments,
  context: KeystoneContext
) {
  // get the subscription from the id
  const variation = await context.query.Variation.findOne({
    where: { id: variationId },
    query: graphql`
            id
            stripePriceId
            `,
  });
  const user = await context.query.User.findOne({
    where: { id: userId },
    query: graphql`
            id
            stripeCustomerId
            `,
  });
  const session = await stripeSession({
    priceId: variation.stripePriceId,
    customerId: user.stripeCustomerId,
    frontendUrl: returnUrl,
  });

  await context.query.Membership.createOne({
    data: {
      user: { connect: { id: userId } },
      variation: { connect: { id: variationId } },
      signupSessionId: session.id,
      stripeSubscriptionId: session.subscription || cuid(),
    },
  });
  return session;
}
export default membershipSignup;
