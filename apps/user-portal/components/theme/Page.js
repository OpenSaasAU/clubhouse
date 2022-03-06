import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';
import { Footer } from './Footer';
import { Header } from './Header';
import React from 'react';


export function Page({ children }) {
  return (
    <>
      <Header />
      <Container style={{ paddingBottom: '15rem', paddingTop: '5rem' }}>{children}</Container>
      <Footer />
    </>
  );
}


