import { useRouter } from 'next/dist/client/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Container, Row, Button } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { DocumentBlock } from '../../../components/DocumentBlock';
import { SubscribeButton } from '../../../components/SubscribeButton';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($slug: String!) {
    subscription(where: { slug: $slug }) {
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

  const { subscription, club, returnStatus } = router.query;
  console.log(subscription, club, returnStatus);

  const { loading, error, data } = useQuery(SINGLE_ITEM_QUERY, {
    variables: {
      slug: subscription,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data.subscription)
    return <p>No subscription found for {subscription}</p>;

  if (returnStatus === 'success') {
    return (
      <Container>
        <Row>
          <h2>Thanks for becoming a member</h2>
        </Row>
        <br />
        <Button
          variant="primary"
          type="button"
          onClick={() => router.push('/')}
        >
          Back to Home
        </Button>
      </Container>
    );
  }
  return (
    <Container>
      <Row>
        <h2>
          Opps - either something went wrong, or the process was cancelled
        </h2>
        <p> Maybe try again or contact the ${club}</p>
      </Row>
      <Button variant="primary" type="button" onClick={() => router.push('/')}>
        Back to Home
      </Button>
    </Container>
  );
}
