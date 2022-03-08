import { useRouter } from "next/dist/client/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { SubscribeButton } from "../../../components/SubscribeButton";
import { Container, Row, Button } from "react-bootstrap";
import { DocumentBlock } from "../../../components/DocumentBlock";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

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
  console.log(userData?.data);

  const { subscription } = router.query;
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
        <Button
          onClick={() =>
            signIn("auth0", {
              callbackUrl: `${window.location.origin}`,
            })
          }
        >
          Start
        </Button>
      ) : (
        <SubscribeButton />
      )}
      <Button variant="primary" type="button" onClick={() => router.push("/")}>
        Back to Home
      </Button>
    </Container>
  );
}
