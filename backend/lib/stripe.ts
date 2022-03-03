import Stripe from "stripe";

const stripeConfig = new Stripe(process.env.STRIPE_SECRET || "", {
  apiVersion: "2020-08-27",
});

export default stripeConfig;

export const stripeSession = async ({
  priceId,
  frontendUrl,
}: {
  priceId: string;
  frontendUrl: string;
}) => {
  const session = await stripeConfig.checkout.sessions.create({
    mode: "subscription",
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

export const stripeHook = async ({ req, createContext }: any) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripeConfig.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return 400;
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  switch (eventType) {
    case "checkout.session.completed":
      // Payment is successful and the subscription is created.
      // You should provision the subscription and save the customer ID to your database.
      break;
    case "invoice.paid":
      // Continue to provision the subscription as payments continue to be made.
      // Store the status in your database and check when a user accesses your service.
      // This approach helps you avoid hitting rate limits.
      break;
    case "invoice.payment_failed":
      // The payment failed or the customer does not have a valid payment method.
      // The subscription becomes past_due. Notify your customer and send them to the
      // customer portal to update their payment information.
      break;
    default:
    // Unhandled event type
  }

  return 200;
};
