import { Button } from 'react-bootstrap';
import getConfig from 'next/config';
import { useMutation } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/dist/client/router';
import gql from 'graphql-tag';
import { User } from '../types';
import { SigninButton } from './SigninButton';

export function ManageStripeButton() {
  const { data: userData, status } = useSession();
  const userSession = userData?.data as User;
  const router = useRouter();

  const MANAGE_STRIPE_MUTATION = gql`
    mutation MANAGE_STRIPE_MUTATION($returnUrl: String!) {
      manageStripe(returnUrl: $returnUrl)
    }
  `;

  const [getPortalSession] = useMutation(MANAGE_STRIPE_MUTATION, {
    // refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  if (!userSession) {
    return <SigninButton />;
  }

  return (
    <Button
      onClick={async () => {
        const portalSession = await getPortalSession({
          variables: {
            returnUrl: `${window.location.origin}/profile`,
          },
        });
        router.push(portalSession.data.url);
      }}
    >
      Manage Membership
    </Button>
  );
}
