import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { 
  FaRocket, 
  FaGlobe, 
  FaMeteor, 
  FaSatellite, 
  FaSearch,
  FaBars,
  FaTimes,
  FaImage,
  FaMoon,
  FaSnowflake,
  FaSun,
  FaGraduationCap,
  FaFire,
  FaThermometerHalf,
  FaCogs
} from 'react-icons/fa';

const Navigation = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: <FaRocket /> },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Navbar 
      expand="lg" 
      className="nasa-navbar"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="nasa-brand">
          <FaRocket className="me-2" />
          NASA Data Explorer
        </Navbar.Brand>
        
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav"
          className="nasa-toggle"
        >
          {expanded ? <FaTimes /> : <FaBars />}
        </Navbar.Toggle>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {navItems.map((item) => (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                className={`nasa-nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setExpanded(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation; 