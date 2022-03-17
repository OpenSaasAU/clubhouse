import { useRouter } from 'next/dist/client/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Container, Row, Button } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { DocumentBlock } from '../../../components/DocumentBlock';
import { SubscribeButton } from '../../../components/SubscribeButton';
import { SigninButton } from '../../../components/SigninButton';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($variationId: String!) {
    variation(where: { id: $variationId }) {
      name
      about {
        document
      }
      id
      subscription {
        id
        name
        slug
        club {
          id
          name
        }
      }
    }
  }
`;

export default function SubscriptionPage() {
  const router = useRouter();
  const { data: userData, status } = useSession();

  const { subscription, club, variationId } = router.query;
  const { loading, error, data } = useQuery(SINGLE_ITEM_QUERY, {
    variables: {
      id: variationId,
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data.club) return <p>No subscription found for {subscription}</p>;
  return (
    <Container>
      <Row>
        <h2>Add Membership - {data.variation.name}</h2>
      </Row>
      <br />
      {!userData ? (
        <SigninButton returnUrl={`/${club}/${subscription}`} />
      ) : (
        <SubscribeButton
          variation={data.variation}
          subscription={subscription}
          club={club}
        />
      )}
      <Button
        variant="primary"
        type="button"
        onClick={() => router.push(`/${club}`)}
      >
        Back to ${data.variation.subscription.club.name}
      </Button>
    </Container>
  );
}
