import { Navbar } from 'react-bootstrap';
import { useRouter } from 'next/dist/client/router';
import Image from 'next/image';
import React from 'react';
import getConfig from 'next/config';

export function Footer() {

  const { publicRuntimeConfig } = getConfig();
    return (
      <Navbar bg="dark" fixed="bottom" variant="dark" expand="sm">
        <Navbar.Text>
        {' '}
        Please email {publicRuntimeConfig?.supportEmail || "set@SUPPORT_EMAIL.env"} if you have any difficulties 
        with this site
        </Navbar.Text>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {' '}
            Thank you for supporting the Old Church on the Hill
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    );
}
