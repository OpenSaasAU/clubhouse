import { useRouter } from "next/dist/client/router";
import { Container, Row, Button } from "react-bootstrap";
import { DocumentBlock } from "../../../components/DocumentBlock";
import { useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import gql from "graphql-tag";

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
      }
    }
  }
`;

export default function HomePage() {
  const router = useRouter();
  const { data: userData, status } = useSession();
  console.log(userData?.data);

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

      <br />
      {!userData ? (
        <Button onClick={() => router.push(`/clubs/${club}/subscribe`)}>
          Subscribe
        </Button>
      ) : (
        <Button onClick={() => router.push(`/clubs/${club}/membership`)}>
          My Membership
        </Button>
      )}
      <Button variant="primary" type="button" onClick={() => router.push("/")}>
        Back to Home
      </Button>
    </Container>
  );
}
