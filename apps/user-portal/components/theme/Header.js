import { Navbar, Nav, Button } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Container } from "react-bootstrap";

export function Header() {
  const { data, status } = useSession();
  return (
    <Navbar bg="light" expand="sm">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Link href="/" passHref>
              <Nav.Link>Home</Nav.Link>
            </Link>
            <Link href="/about" passHref>
              <Nav.Link>About</Nav.Link>
            </Link>
            <Link href="/contact" passHref>
              <Nav.Link>Contact</Nav.Link>
            </Link>
            <Link href="/products" passHref>
              <Nav.Link>Products</Nav.Link>
            </Link>
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
            ) : (<>
              <Link href='/account' passHref>
                <Nav.Link>Account</Nav.Link>
              </Link>
              <Link href='/membership' passHref>
                <Nav.Link>Membership</Nav.Link>
              </Link>
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
          </Nav>
        </Navbar.Collapse>
        <Navbar.Brand
          style={{ marginLeft: 4 + "rem", marginBottom: 1 + "rem" }}
        >
          <Link href="https://www.theoldchurchonthehill.com">
            <Image
              src="/images/logo-blue-oldchurch.png"
              height="70"
              width="100"
              alt="Old Church Logo"
            />
          </Link>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}
