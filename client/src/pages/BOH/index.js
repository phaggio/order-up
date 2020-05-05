import React from 'react';
import { Container } from 'react-bootstrap';
import BohHeader from '../../components/BohHeader';
import BohBody from '../../components/BohBody';
import './style.css';

function Boh() {
  return (
    <Container>
      <BohHeader />
      <BohBody />
    </Container>
  );
}

export default Boh;