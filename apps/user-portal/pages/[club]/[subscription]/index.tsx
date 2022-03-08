import { useRouter } from "next/dist/client/router";
import { Container, Row, Button } from "react-bootstrap";
import { DocumentBlock } from "../../../components/DocumentBlock";
import { useMutation, useQuery } from "@apollo/client";
import { useSession, signIn } from "next-auth/react";
import gql from "graphql-tag";

import { CURRENT_USER_QUERY, useForm, useUser } from "../../../lib/form";

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($slug: String!) {
    subscription(where: { slug: $slug }) {
      name
      slug
      stripeProductId
      about {
        document
      }
      variations {
        id
        stripePriceId
        price
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
const SUBSCRIPTION_MUTATION = gql`
  mutation SUBSCRIPTION_MUTATION(
    $variationId: ID!
    $userId: ID!
    $returnUrl: String!
  ) {
    membershipSignup(
      userId: $userId
      returnUrl: $returnUrl
      variationId: $variationId
    )
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
  const [getStripeSession] = useMutation(SUBSCRIPTION_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
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
      {!userData && (
        <Button
          onClick={() =>
            signIn("auth0", {
              callbackUrl: `${window.location.origin}`,
            })
          }
        >
          Get Started
        </Button>
      )}
      {data.subscription.variations.map((variation) => (
        <Button
          onClick={async () => {
            console.log(userData.id);

            const session = await getStripeSession({
              variables: {
                variationId: variation.id,
                userId: userData.data.id,
                returnUrl: `${window.location.origin}/${club}/${subscription}`,
              },
            });
            console.log(JSON.stringify(session));
            router.push(session.data.membershipSignup.url);
          }}
        >
          Subscribe
        </Button>
      ))}

      <br />
      <br />

      <Button variant="primary" type="button" onClick={() => router.push("/")}>
        Back to Home
      </Button>
    </Container>
  );
}
