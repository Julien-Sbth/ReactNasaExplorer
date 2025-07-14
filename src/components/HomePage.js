import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaRocket, 
  FaGlobe, 
  FaMeteor, 
  FaSatellite, 
  FaSearch,
  FaCloudSun,
  FaImage,
  FaMoon,
  FaSnowflake,
  FaSun,
  FaGraduationCap,
  FaFire,
  FaThermometerHalf,
  FaCogs
} from 'react-icons/fa';

const HomePage = () => {
  const features = [
    {
      title: 'APOD - Image of the Day',
      description: 'Admire a new spectacular image of the universe every day, with fascinating explanations from NASA.',
      icon: <FaGlobe size={40} />,
      path: '/apod',
      color: 'linear-gradient(45deg, #0B3D91, #6B46C1)',
      delay: 0.1
    },
    {
      title: 'NEO Asteroids',
      description: 'Monitor near-Earth asteroids and discover celestial objects crossing our orbit.',
      icon: <FaMeteor size={40} />,
      path: '/neo',
      color: 'linear-gradient(45deg, #FF6B35, #E91E63)',
      delay: 0.2
    },
    {
      title: 'Mars Photos',
      description: 'Explore the Red Planet through unique photos taken by the Curiosity and Perseverance rovers.',
      icon: <FaSatellite size={40} />,
      path: '/mars',
      color: 'linear-gradient(45deg, #FF6B35, #8B4513)',
      delay: 0.3
    },
    {
      title: 'Earth Images',
      description: 'See our planet from space with real-time EPIC satellite images.',
      icon: <FaGlobe size={40} />,
      path: '/epic',
      color: 'linear-gradient(45deg, #00BCD4, #4CAF50)',
      delay: 0.4
    },
    {
      title: 'Exoplanets',
      description: 'Dive into the discovery of distant worlds and learn more about extrasolar planets.',
      icon: <FaSearch size={40} />,
      path: '/exoplanets',
      color: 'linear-gradient(45deg, #9C27B0, #3F51B5)',
      delay: 0.5
    },
    {
      title: 'Space Weather',
      description: 'Stay informed about solar storms and space phenomena with DONKI data.',
      icon: <FaCloudSun size={40} />,
      path: '/donki',
      color: 'linear-gradient(45deg, #FF9800, #F44336)',
      delay: 0.6
    },
    {
      title: 'Tech Transfer',
      description: 'Discover NASA innovations and patents that are transforming our daily lives.',
      icon: <FaCogs size={40} />,
      path: '/techtransfer',
      color: 'linear-gradient(45deg, #607D8B, #795548)',
      delay: 0.7
    },
    {
      title: 'InSight Weather',
      description: 'Check live weather reports from the surface of Mars with the InSight mission.',
      icon: <FaThermometerHalf size={40} />,
      path: '/insight',
      color: 'linear-gradient(45deg, #E91E63, #9C27B0)',
      delay: 0.8
    },
    {
      title: 'NASA Images',
      description: 'Access a vast gallery of images and videos from NASA’s space missions.',
      icon: <FaImage size={40} />,
      path: '/nasa-images',
      color: 'linear-gradient(45deg, #2196F3, #00BCD4)',
      delay: 0.9
    },
    {
      title: 'Lunar Samples',
      description: 'Discover rocks and lunar dust brought back by the Apollo missions.',
      icon: <FaMoon size={40} />,
      path: '/lunar-samples',
      color: 'linear-gradient(45deg, #9E9E9E, #607D8B)',
      delay: 1.0
    },
    {
      title: 'Antarctic Meteorites',
      description: 'Explore rare meteorites found in Antarctica and their scientific importance.',
      icon: <FaSnowflake size={40} />,
      path: '/antarctic-meteorites',
      color: 'linear-gradient(45deg, #E3F2FD, #90CAF9)',
      delay: 1.1
    },
    {
      title: 'NASA POWER',
      description: 'Analyze global climate and energy data provided by NASA.',
      icon: <FaSun size={40} />,
      path: '/nasa-power',
      color: 'linear-gradient(45deg, #FF9800, #FFC107)',
      delay: 1.2
    },
    {
      title: 'STEM Education',
      description: 'Enjoy educational resources for all ages and develop your STEM skills.',
      icon: <FaGraduationCap size={40} />,
      path: '/stem',
      color: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
      delay: 1.3
    },
    {
      title: 'Earth Data',
      description: 'Examine detailed satellite images and geospatial data of Earth.',
      icon: <FaGlobe size={40} />,
      path: '/earth',
      color: 'linear-gradient(45deg, #4CAF50, #00BCD4)',
      delay: 1.4
    },
    {
      title: 'Fireballs',
      description: 'Track fireballs and meteors detected by observation networks around the world.',
      icon: <FaFire size={40} />,
      path: '/fireballs',
      color: 'linear-gradient(45deg, #F44336, #FF5722)',
      delay: 1.5
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <Container fluid className="home-page">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hero-section text-center py-5"
      >
        <h1 className="display-2 mb-3" style={{ letterSpacing: '2px', fontWeight: 800 }}>
          <FaRocket className="me-3" style={{ color: '#FC3D21', filter: 'drop-shadow(0 0 8px #FC3D21)' }} />
          NASA <span style={{ color: '#6B46C1' }}>Data</span>
        </h1>
        <p className="lead mb-5" style={{ fontSize: '1.35rem', maxWidth: 700, margin: '0 auto', opacity: 0.92 }}>
          Explore the universe with NASA’s most fascinating data: breathtaking images, planetary discoveries, meteorites, space weather, and much more.
        </p>
        <div className="hero-stats">
          <Row className="justify-content-center">
            <Col md={4} className="text-center">
              <div className="stat-item" style={{ minHeight: 110 }}>
                <h3 style={{ fontSize: '2.7rem', color: '#FC3D21' }}>∞</h3>
                <p style={{ fontSize: '1.15rem' }}>Endless NASA Data</p>
              </div>
            </Col>
          </Row>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="features-section py-5"
      >
        <h2 className="text-center mb-5" style={{ fontWeight: 700, letterSpacing: '1.5px' }}>
          Discover the Universe
        </h2>
        <Row>
          {features.map((feature, index) => (
            <Col key={index} lg={4} md={6} className="mb-4">
              <motion.div variants={cardVariants}>
                <Card className="nasa-card feature-card h-100">
                  <Card.Body className="text-center">
                    <div 
                      className="feature-icon mb-3"
                      style={{ background: feature.color }}
                    >
                      {feature.icon}
                    </div>
                    <Card.Title className="h5 mb-3">{feature.title}</Card.Title>
                    <Card.Text className="text-muted mb-4">
                      {feature.description}
                    </Card.Text>
                    <Button 
                      as={Link} 
                      to={feature.path}
                      className="btn-nasa w-100"
                      style={{ background: feature.color }}
                    >
                      Explorer
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>
    </Container>
  );
};

export default HomePage; 