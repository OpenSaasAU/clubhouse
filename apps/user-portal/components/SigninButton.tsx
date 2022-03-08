import { signIn, signOut, useSession } from "next-auth/react";
import { Navbar, Nav, Button } from "react-bootstrap";
import Link from "next/link";

export function SigninButton() {
  const { data, status } = useSession();
  return (
    <>
      {!data ? (
        <Button
          onClick={() =>
            signIn("auth0", {
              callbackUrl: `${window.location.origin}`,
            })
          }
        >
          Sign In
        </Button>
      ) : (
        <>
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
      )}
    </>
  );
}
