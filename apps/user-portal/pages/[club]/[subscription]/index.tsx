import { useRouter } from "next/dist/client/router";
import { Container, Row, Button } from "react-bootstrap";
import { DocumentBlock } from "../../../components/DocumentBlock";
import { useQuery } from "@apollo/client";
import { useSession, signIn } from "next-auth/react";
import gql from "graphql-tag";

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($slug: String!) {
    subscription(where: { slug: $slug }) {
      name
      slug
      stripeProduct
      about {
        document
      }
      variations {
        id
        stripePrice
        cost
        chargeInterval
        chargeIntervalCount
      }
      id
      club {
        id
        name
      }
    }
  }
`;

export default function SucscriptionPage() {
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
  if (!data.subscription)
    return <p>No subscription found for {subscription}</p>;
  return (
    <Container>
      <Row>
        <h2>{data.subscription.name}</h2>
        <DocumentBlock document={data.subscription.about.document} />
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
          Get Started
        </Button>
      ) : (
        <Button
          onClick={() =>
            router.push(`/${data.subscription.club.name}/membership`)
          }
        >
          My Membership
        </Button>
      )}
      <br />
      <br />

      <Button variant="primary" type="button" onClick={() => router.push("/")}>
        Back to Home
      </Button>
    </Container>
  );
}
