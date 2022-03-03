//@ts-ignore
import dotenv from "dotenv";
import { config } from "@keystone-6/core";
import { statelessSessions } from "@keystone-6/core/session";
import { createAuth } from "@opensaas/keystone-nextjs-auth";
import Auth0 from "@opensaas/keystone-nextjs-auth/providers/auth0";
import { stripeHook } from "./lib/stripe";

import { lists } from "./schemas";

dotenv.config();

let sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "The SESSION_SECRET environment variable must be set in production"
    );
  } else {
    sessionSecret = "-- DEV COOKIE SECRET; CHANGE ME --";
  }
}

let sessionMaxAge = 60 * 60 * 24 * 30; // 30 days

const auth = createAuth({
  listKey: "User",
  identityField: "subjectId",
  sessionData: `id name email role { id name } memberships { id status variation { id name } }`,
  autoCreate: true,
  userMap: { subjectId: "id", name: "name" },
  accountMap: {},
  profileMap: { email: "email" },
  sessionSecret,
  providers: [
    Auth0({
      clientId: process.env.AUTH0_CLIENT_ID || "Auth0ClientID",
      clientSecret: process.env.AUTH0_CLIENT_SECRET || "Auth0ClientSecret",
      issuer:
        process.env.AUTH0_ISSUER_BASE_URL || "https://opensaas.au.auth0.com",
    }),
  ],
});

export default auth.withAuth(
  config({
    db: {
      provider: "postgresql",
      url:
        process.env.DATABASE_URL ||
        "postgres://postgres:mysecretpassword@localhost:55000",
    },
    ui: {
      isAccessAllowed: (context) => !!context.session?.data,
    },
    lists,
    experimental: {
      generateNodeAPI: true,
      enableNextJsGraphqlApiEndpoint: true,
    },
    session: statelessSessions({
      maxAge: sessionMaxAge,
      secret: sessionSecret,
    }),
    server: {
      extendExpressApp: (app, createContext) => {
        app.use(
          "/api/stripe-webhook",
          async (res: any, req: any) =>
            await stripeHook({ req, createContext }).then((code) =>
              res.sendStatus(code)
            )
        );
      },
    },
  })
);
