import { signIn, signOut, useSession } from 'next-auth/react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import Link from 'next/link';

export function SigninButton({ ...props }) {
  const { returnUrl } = props;
  const { data, status } = useSession();
  if (!data)
    return (
      <Button
        onClick={() =>
          signIn('azure-ad-b2c', {
            callbackUrl: `${window.location.origin}${returnUrl || '/'}`,
          })
        }
      >
        Get Started/Sign In
      </Button>
    );
  return (
    <Button
      onClick={() =>
        signOut({
          callbackUrl: `${window.location.origin}`,
        })
      }
    >
      Sign Out
    </Button>
  );
}
