import { Navbar, Nav, Button } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Container } from "react-bootstrap";
import { SigninButton } from "../SigninButton";

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
            <Link href="/pantry/posts" passHref>
              <Nav.Link>News</Nav.Link>
            </Link>
            {data && (
              <>
            <Link href="/pantry/my-membership" passHref>
              <Nav.Link>Pantry Membership</Nav.Link>
            </Link>
           <Link href="/profile" passHref>
            <Nav.Link>Profile</Nav.Link>
          </Link>
          </>
          )}

          <SigninButton />
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
