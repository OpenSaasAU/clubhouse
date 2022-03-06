import { stripeSession } from "./lib/stripe";
//@ts-ignore
import dotenv from "dotenv";
import { extendGraphqlSchema } from "./mutations";
import { config } from "@keystone-6/core";
import { statelessSessions } from "@keystone-6/core/session";
import { createAuth } from "@opensaas/keystone-nextjs-auth";
import Auth0 from "@opensaas/keystone-nextjs-auth/providers/auth0";
import { stripeHook } from "./lib/stripe";
import express from "express";
import url from "url";

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
  keystonePath: "/admin",
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
    extendGraphqlSchema,
    session: statelessSessions({
      maxAge: sessionMaxAge,
      secret: sessionSecret,
    }),
    server: {
      extendExpressApp: (app, createContext) => {
        app.use(
          express.json({
            // We need the raw body to verify webhook signatures.
            // Let's compute it only when hitting the Stripe webhook endpoint.
            verify: function (req, res, buf) {
              const pathname = url.parse(req?.url!).pathname;
              console.log(buf.toString());

              if (
                pathname?.includes("/api/stripe-webhook") &&
                req.method === "POST"
              ) {
                (req as any).rawBody = buf.toString();
              }
            },
          })
        ),
          app.use("/rest", async (req, res, next) => {
            (req as any).context = await createContext(req, res);
            next();
          });
        app.get("/get-stripe-session", stripeSession);
        app.post("/api/stripe-webhook", stripeHook);
        app.post("/test", (req, res) => {
          console.log(req.body);
          res.sendStatus(200);
        });
      },
    },
  })
);
