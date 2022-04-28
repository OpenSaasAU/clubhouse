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
  { variationId, returnUrl }: Arguments,
  context: KeystoneContext
) {
  const userId = context.session?.itemId;
  if (!userId) {
    console.log("No user signed in");
    return { error: "No user signed in" };
  };
  // get the subscription from the id
  const variation = await context.query.Variation.findOne({
    where: { id: variationId },
    query: graphql`
            id
            stripePriceId
            `,
  });
  if (!variation) {
    console.log("No variation found");
    return { error: "No variation found" };
  };
  const user = await context.query.User.findOne({
    where: { id: userId },
    query: graphql`
            id
            stripeCustomerId
            `,
  });
  if (!user) {
    console.log("No user found");
    return { error: "No user found" };
  };
  const session = await stripeSession({
    priceId: variation.stripePriceId,
    customerId: user.stripeCustomerId,
    frontendUrl: returnUrl,
  });
  if (!session) {
    console.log("No stripe session created");
    return { error: "No stripe session created" };
  };

  await context.query.Membership.createOne({
    data: {
      user: { connect: { id: userId } },
      variation: { connect: { id: variationId } },
      signupSessionId: session?.id,
      stripeSubscriptionId: session?.subscription || cuid(),
    },
  });
  return session;
}
export default membershipSignup;
