import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { HashLink } from 'react-router-hash-link';
import {
  BrowserRouter as Router
} from "react-router-dom";

export const NavBar = () => {

  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [])

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  }
  return (
    <Router>
    <Navbar expand="lg" className={scrolled ? "scrolled":""}>
      <Container>
        <Navbar.Brand href="#home" className="navtext">Body Language Decoder</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#home" className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={() =>onUpdateActiveLink('home')}>Home</Nav.Link>
             <Nav.Link href="#feedbackform" className={activeLink === 'about' ? 'active navbar-link' : 'navbar-link'}  onClick={() =>onUpdateActiveLink('about')}>Contact</Nav.Link>
          </Nav>
          <span className="navbar-text">
            <HashLink smooth to='#content'>
                <button className="vvd"><span>Let's Start</span></button>
              </HashLink>
            </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </Router> 
  )
}