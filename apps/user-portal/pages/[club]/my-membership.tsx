import { useRouter } from "next/dist/client/router";
import { useForm, useUser } from "../../lib/form";
import getConfig from "next/config";
import Link from "next/link";

export default function MyMembership() {
  const user = useUser();
  const memberships = user?.memberships || [];
  const router = useRouter();
  const { club } = router.query;

  const { publicRuntimeConfig } = getConfig();

  // if user has membership
  console.log(memberships);
  if (memberships.length === 0) {
    return (
      <>
        <h2>You Don't have any memberships yet</h2>
        <Link href={`/${club}`}>See Memberships</Link>
      </>
    );
  }
  // if no memberships create one
  // 1. Show card list of possible memberships with About modal and create
  // 2. Show form to create a membership
  // 3. Create subscription through stripe
  return (
    <>
      <h3>Thanks for becoming a member...</h3>
      {memberships.map((membership) => (
        <div key={membership.id}>
          <h4>
            {club[0].toUpperCase() + club.substring(1)} - Membership -{" "}
            {membership.variation.subscription.name}
          </h4>
          <p>Variation - {membership.variation.name}</p>
          <p>Status - {membership.status}</p>
          <p>Cancel</p> <p>Renew</p>
          <Link href={`/${club}/${membership.variation.subscription.slug}`}>
            Find out More
          </Link>
        </div>
      ))}
    </>
  );
}
