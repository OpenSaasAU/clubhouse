/* eslint-disable react/function-component-definition */
import { Container, Button } from 'react-bootstrap';
import { signIn, signOut, useSession } from 'next-auth/react';
import { SignupButton } from '../components/SignupButton';
import { useUser, CURRENT_USER_QUERY } from '../lib/form';

export default function SignupPage({ ...props }) {
  const user = useUser();

  const { data, status } = useSession();
  if (status === 'loading') return <Container>Loading... </Container>;

  return (
    <Container>
      <h1>Welcome to The Old Church on the Hill Community Pantry</h1>
      {data ? (
        <>
          <p>
            Welcome
            {data.user.name}, we have your Session email as
            {data.user.email}
            {JSON.stringify(user)}
            {JSON.stringify(data)}
          </p>
          <Button
            onClick={() =>
              signOut({
                callbackUrl: `${window.location.origin}`,
              })
            }
          >
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <p>
            We can see you are not signed in, click here to signin or signup
          </p>
          <br />
          <SignupButton />
          <Button
            onClick={() =>
              signIn('azure-ad-b2c', {
                callbackUrl: `${window.location.origin}`,
              })
            }
          >
            Sign In/Sign Up
          </Button>
        </>
      )}
    </Container>
  );
}
