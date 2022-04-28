//@ts-ignore
import dotenv from 'dotenv';
import { extendGraphqlSchema } from './mutations';
import { config } from '@keystone-6/core';
import { statelessSessions } from '@keystone-6/core/session';
import { createAuth } from '@opensaas/keystone-nextjs-auth';
import AzureB2C from '@opensaas/keystone-nextjs-auth/providers/azure-ad-b2c';
import { stripeHook } from './lib/stripe';
import { permissionsList } from './schemas/roleFields';

import express from 'express';
import url from 'url';

import { lists } from './schemas';

dotenv.config();

let sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'The SESSION_SECRET environment variable must be set in production'
    );
  } else {
    sessionSecret = '-- DEV COOKIE SECRET; CHANGE ME --';
  }
}

let sessionMaxAge = 60 * 60 * 24 * 30; // 30 days

const auth = createAuth({
  listKey: 'User',
  identityField: 'subjectId',
  sessionData: `id name email isAdmin role { ${permissionsList.join(' ')} } memberships { id name status startDate renewalDate variation { id name subscription { id name }}}`,
  autoCreate: true,
  resolver: async ({ user, profile }: { user: any; profile: any }) => {
    const preferredName = profile.given_name || user.name;
    const phone = profile.extension_PhoneNumber;
    const username = user.name as string;
    const email = user.email as string;
    return { email, username, preferredName, phone };
  },
  sessionSecret,
  keystonePath: '/admin',
  providers: [
    AzureB2C({
      tenantId: process.env.B2C_TENANT_ID || 'tenant-id',
      clientId: process.env.B2C_CLIENT_ID || 'ClientID',
      clientSecret: process.env.B2C_CLIENT_SECRET || 'ClientSecret',
      primaryUserFlow: process.env.B2C_FLOW || 'B2C_1_SignUp',
      authorization: { params: { scope: "offline_access openid" }}
    }),
  ],
});

export default auth.withAuth(
  config({
    db: {
      provider: 'postgresql',
      useMigrations: true,
      url:
        process.env.DATABASE_URL ||
        'postgres://postgres:mysecretpassword@localhost:55000',
    },
    ui: {
      isAccessAllowed: (context) => context.session?.data?.isAdmin,
    },
    lists,
    extendGraphqlSchema,
    experimental: {
      enableNextJsGraphqlApiEndpoint: true,
      generateNextGraphqlAPI: true,
    },
    session: statelessSessions({
      maxAge: sessionMaxAge,
      secret: sessionSecret,
    }),
    server: {
      healthCheck: true,
      extendExpressApp: (app, createContext) => {
        app.use(
          '/api/stripe-webhook',
          express.json({
            // We need the raw body to verify webhook signatures.
            // Let's compute it only when hitting the Stripe webhook endpoint.
            verify: function (req, res, buf) {
              const pathname = url.parse(req?.url!).pathname;

              if (req.method === 'POST') {
                (req as any).rawBody = buf.toString();
              }
            },
          })
        );
        app.use('/api/stripe-webhook', async (req, res, next) => {
          (req as any).context = await createContext(req, res);
          next();
        });
        app.post('/api/stripe-webhook', stripeHook);
      },
    },
  })
);
