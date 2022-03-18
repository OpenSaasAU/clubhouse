import { useRouter } from 'next/dist/client/router';
import { Container, Row, Button } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import gql from 'graphql-tag';
import { useUser } from '../../lib/form';

import { DocumentBlock } from '../../components/DocumentBlock';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($slug: String!) {
    club(where: { slug: $slug }) {
      name
      description
      slug
      about {
        document
      }
      id
      subscriptions {
        id
        name
        slug
        description
        about {
          document
        }
      }
    }
  }
`;

export default function ClubPage() {
  const router = useRouter();
  const user = useUser();
  const memberships = user?.memberships || [];
  const { data: userData, status } = useSession();

  const { club } = router.query;
  const { loading, error, data } = useQuery(SINGLE_ITEM_QUERY, {
    variables: {
      slug: club,
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data.club) return <p>No club found for {club}</p>;
  return (
    <Container>
      <Row>
        <h2>{data.club.name}</h2>
        <DocumentBlock document={data.club.about.document} />
      </Row>

      <h3>Available Subscriptions</h3>
      {data.club.subscriptions.map((subscription) => (
        <Row key={subscription.id}>
          <h4>{subscription.name}</h4>
          <p>{subscription.description}</p>
          <Button
            variant="primary"
            type="button"
            onClick={() => router.push(`/${club}/${subscription.slug}`)}
          >
            Find out More/Subscribe
          </Button>
        </Row>
      ))}
    </Container>
  );
}
