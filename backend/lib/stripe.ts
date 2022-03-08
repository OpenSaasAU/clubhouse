import Stripe from "stripe";

import type { Request, Response } from "express";
import type { KeystoneContext } from "@keystone-6/core/types";

const stripeConfig = new Stripe(process.env.STRIPE_SECRET || "", {
  apiVersion: "2020-08-27",
});

const graphql = String.raw;

export default stripeConfig;

export const stripeSession = async ({
  priceId,
  customerId,
  frontendUrl,
}: {
  priceId: string;
  customerId: string;
  frontendUrl: string;
}) => {
  const session = await stripeConfig.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [
      {
        price: priceId,
        // For metered billing, do not pass quantity
        quantity: 1,
      },
    ],
    // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
    // the actual Session ID is returned in the query parameter when your customer
    // is redirected to the success page.
    success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendUrl}/canceled`,
  });
  return session;
};

export const stripePortalSession = async ({
  stripeCustomerId,
  returnUrl,
}: {
  stripeCustomerId: string;
  returnUrl: string;
}) => {
  const portalSession = await stripeConfig.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });
  return portalSession;
};

export async function stripeHook(req: Request, res: Response) {
  const context = (req as any).context as KeystoneContext;
  let data;
  let eventType;
  // Check if webhook signing is configured.
  const webhookSecret =
    "whsec_dc197429e82997fc8346176e159944dcf140952afda76c7d2ea37331d1af42ab";
  if (webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripeConfig.webhooks.constructEvent(
        (req as any).rawBody,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event?.data;
    eventType = event?.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.

    data = req.body.data;
    eventType = req.body.type;
  }
  console.log("Stripe Webhook Data", data);
  console.log("Stripe Webhook Event Type", eventType);

  switch (eventType) {
    case "checkout.session.completed":
      const membership = await context.query.Membership.findOne({
        where: { signupSessionId: data.object.id },
        query: graphql`
                id
                user {
                  id
                }
                `,
      });
      await context.query.Membership.updateOne({
        where: { id: membership.id },
        data: {
          status: "PAID",
          stripeSubscriptionId: data.object.subscription,
        },
      });
      // Payment is successful and the subscription is created.

      // You should provision the subscription and save the customer ID to your database.
      break;
    case "invoice.paid":
      // Continue to provision the subscription as payments continue to be made.
      // Store the status in your database and check when a user accesses your service.
      // This approach helps you avoid hitting rate limits.
      break;
    case "invoice.payment_failed":
      const failedMembership = await context.query.Membership.findOne({
        where: { stripeSubscriptionId: data.object.subscription },
        query: graphql`
                id
                user {
                  id
                }
                `,
      });
      await context.query.Membership.updateOne({
        where: { id: failedMembership.id },
        data: {
          status: "FAILED",
          stripeSubscriptionId: data.object.subscription,
        },
      });
      // The payment failed or the customer does not have a valid payment method.
      // The subscription becomes past_due. Notify your customer and send them to the
      // customer portal to update their payment information.
      break;
    default:
    // Unhandled event type
  }

  res.sendStatus(200);
}
