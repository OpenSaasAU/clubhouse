import { useRouter } from 'next/dist/client/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Container, Row, Button } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { DocumentBlock } from '../../../components/DocumentBlock';
import { SubscribeButton } from '../../../components/SubscribeButton';
import { SigninButton } from '../../../components/SigninButton';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($slug: String!) {
    subsciption(where: { slug: $slug }) {
      name
      slug
      about {
        document
      }
      id
      club {
        id
        name
      }
    }
  }
`;

export default function SubscriptionPage() {
  const router = useRouter();
  const { data: userData, status } = useSession();

  const { subscription, club } = router.query;
  const { loading, error, data } = useQuery(SINGLE_ITEM_QUERY, {
    variables: {
      slug: subscription,
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data.club) return <p>No subscription found for {subscription}</p>;
  return (
    <Container>
      <Row>
        <h2>Add Membership - {data.subscription.name}</h2>
      </Row>
      <br />
      {!userData ? (
        <SigninButton returnUrl={`/${club}/${subscription}`} />
      ) : (
        <SubscribeButton />
      )}
      <Button variant="primary" type="button" onClick={() => router.push('/')}>
        Back to Home
      </Button>
    </Container>
  );
}
