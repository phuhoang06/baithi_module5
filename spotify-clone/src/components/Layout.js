import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <i className="bi bi-spotify text-success fs-3 me-2"></i>
            Spotify Music Library
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};

export default Layout; 