import { Button } from 'react-bootstrap';
import React from 'react';
import getConfig from 'next/config';
import { useMutation } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/dist/client/router';
import gql from 'graphql-tag';
import { User } from '../types';
import { SigninButton } from './SigninButton';

export function ManageStripeButton() {
  const { data: userData, status } = useSession();
  const userSession = userData.data as User;
  const router = useRouter();

  const MANAGE_STRIPE_MUTATION = gql`
    mutation MANAGE_STRIPE_MUTATION($userId: ID!, $returnUrl: String!) {
      manageStripe(userId: $userId, returnUrl: $returnUrl)
    }
  `;

  const [getPortalSession] = useMutation(MANAGE_STRIPE_MUTATION, {
    //refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  if (!userData.id) {
    return <SigninButton />;
  }

  return (
    <Button
      onClick={async () => {
        console.log(userData.id);

        const portalSession = await getPortalSession({
          variables: {
            userId: userSession.id,
            returnUrl: `${window.location.origin}/profile`,
          },
        });
        console.log(JSON.stringify(portalSession));
        router.push(portalSession.data.url);
      }}
    >
      Manage
    </Button>
  );
}
