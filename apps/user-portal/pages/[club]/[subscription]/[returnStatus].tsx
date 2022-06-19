import { useRouter } from 'next/dist/client/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Container, Row, Button } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';

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
const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteSubscription(id: $id) {
      id
    }
  }
`;

const GET_MEMBERSHIP_QUERY = gql`
  query GET_MEMBERSHIP_QUERY($session_id: String!) {
    membership(where: { signupSessionId: $session_id }) {
      id
      status
      variation {
        id
        name
        subscription {
          id
          name
          slug
        }
      }
    }
  }
`;

export default function SubscriptionPage() {
  const router = useRouter();
  // TODO: fix the thing that breaks membership when a user clicks back
  const { data: userData, status } = useSession();

  // eslint-disable-next-line camelcase
  const { subscription, club, returnStatus, session_id } = router.query;
  console.log(subscription, club, returnStatus);

  const { loading, error, data } = useQuery(SINGLE_ITEM_QUERY, {
    variables: {
      slug: subscription,
    },
  });
  const {
    loading: memLoad,
    error: memError,
    data: memData,
  } = useQuery(GET_MEMBERSHIP_QUERY, {
    variables: {
      session_id,
    },
  });
  const [deleteItem] = useMutation(DELETE_ITEM_MUTATION);

  if (loading || memLoad) return <p>Loading...</p>;
  if (error || memError) return <p>Error: {error?.message}</p>;
  if (!data.subscription)
    return <p>No subscription found for {subscription}</p>;

  if (returnStatus === 'success') {
    return (
      <Container>
        {memData &&
          <Row>
            <h2>Thanks for becoming a member</h2>
            <p> Variation - {memData.membership.variation.name}</p>
            <p> Status - {memData.membership.status}</p>
          </Row>
        }
        <br />
        <Button
          variant="primary"
          type="button"
          onClick={() => router.push(`/${club}`)}
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
      <Button
        variant="primary"
        type="button"
        onClick={() => {
          // delete the membership
          deleteItem({
            variables: {
              id: memData.membership.id,
            },
          });
          router.push(`/${club}`);
        }}
      >
        Back to Home
      </Button>
    </Container>
  );
}
