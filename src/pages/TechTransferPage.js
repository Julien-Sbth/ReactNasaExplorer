import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FaSearch, FaInfo, FaRocket, FaExternalLinkAlt } from 'react-icons/fa';
import { techTransferService } from '../services/nasaApi';

const TechTransferPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentQuery, setCurrentQuery] = useState('');

  // Query pour les brevets
  const { data: patentsData, isLoading, error, refetch } = useQuery(
    ['techtransfer-patents', currentQuery],
    () => techTransferService.getPatents(currentQuery),
    {
      enabled: !!currentQuery,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setCurrentQuery(searchQuery.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getCategoryBadge = (category) => {
    const categoryColors = {
      'Aeronautics': 'primary',
      'Space Technology': 'success',
      'Earth Science': 'info',
      'Human Exploration': 'warning',
      'Science': 'secondary',
    };
    return categoryColors[category] || 'dark';
  };

  return (
    <Container className="page-container">
      <Helmet>
        <title>Tech Transfer | NASA Data Explorer</title>
        <meta name="description" content="Explorez les brevets et innovations technologiques de la NASA." />
      </Helmet>

      <div className="page-header">
        <h1 className="page-title">Tech Transfer</h1>
        <p className="page-description">
          Explorez les brevets et innovations technologiques de la NASA disponibles pour le transfert technologique.
        </p>
      </div>

      {/* Recherche */}
      <Card className="nasa-card mb-4">
        <Card.Body>
          <Row className="align-items-end">
            <Col md={8}>
              <Form.Group>
                <Form.Label>
                  <FaSearch className="me-2" />
                  Rechercher des brevets
                </Form.Label>
                <Form.Control
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ex: propulsion, satellite, rover, etc."
                  className="nasa-form-control"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Button 
                onClick={handleSearch}
                className="btn-nasa w-100"
                disabled={!searchQuery.trim()}
              >
                <FaSearch className="me-2" />
                Rechercher
              </Button>
            </Col>
          </Row>
          
          <div className="mt-3">
            <small className="text-muted">
              Suggestions : propulsion, satellite, rover, telescope, space station, mars, earth observation
            </small>
          </div>
        </Card.Body>
      </Card>

      {/* Contenu */}
      {isLoading ? (
        <div className="nasa-loader">
          <div className="spinner-border spinner-border-nasa" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="loading-text">Recherche de brevets en cours...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="error-container">
          <FaInfo className="error-icon" />
          <h4>Erreur lors de la recherche</h4>
          <p className="error-message">
            {error.message || 'Impossible de récupérer les brevets.'}
          </p>
          <Button onClick={() => refetch()} className="btn-nasa">
            Réessayer
          </Button>
        </Alert>
      ) : patentsData?.data ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="nasa-card">
            <Card.Header>
              <h3>
                Résultats pour "{currentQuery}"
                <Badge bg="success" className="ms-2">
                  {patentsData.data.results?.length || 0} brevets
                </Badge>
              </h3>
            </Card.Header>
            <Card.Body>
              {patentsData.data.results?.length > 0 ? (
                <div className="row">
                  {patentsData.data.results.map((patent, index) => (
                    <Col key={index} lg={6} className="mb-3">
                      <Card className="nasa-card h-100">
                        <Card.Body>
                          <h6 className="card-title">
                            {patent.title}
                            {patent.category && (
                              <Badge bg={getCategoryBadge(patent.category)} className="ms-2">
                                {patent.category}
                              </Badge>
                            )}
                          </h6>
                          
                          <p className="text-muted mb-2">
                            <strong>Numéro de brevet:</strong> {patent.patentNumber || 'N/A'}
                          </p>
                          
                          <p className="text-muted mb-2">
                            <strong>Date:</strong> {patent.dateIssued ? new Date(patent.dateIssued).toLocaleDateString('fr-FR') : 'N/A'}
                          </p>
                          
                          <p className="text-muted mb-2">
                            <strong>Inventeur:</strong> {patent.inventor || 'N/A'}
                          </p>
                          
                          {patent.abstract && (
                            <p className="mb-3">
                              {patent.abstract.length > 200 
                                ? `${patent.abstract.substring(0, 200)}...` 
                                : patent.abstract
                              }
                            </p>
                          )}
                          
                          <div className="d-flex justify-content-between align-items-center">
                            <Button
                              href={patent.url}
                              target="_blank"
                              variant="outline-primary"
                              size="sm"
                            >
                              <FaExternalLinkAlt className="me-1" />
                              Voir le brevet
                            </Button>
                            
                            {patent.licensingContact && (
                              <small className="text-muted">
                                Contact: {patent.licensingContact}
                              </small>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </div>
              ) : (
                <Alert variant="info" className="text-center">
                  <FaInfo className="me-2" />
                  Aucun brevet trouvé pour cette recherche.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </motion.div>
      ) : currentQuery ? (
        <Alert variant="info" className="text-center">
          <FaInfo className="me-2" />
          Aucun brevet trouvé pour cette recherche.
        </Alert>
      ) : (
        <Card className="nasa-card">
          <Card.Body className="text-center">
            <FaRocket size={64} className="text-muted mb-3" />
            <h4>Recherchez des innovations NASA</h4>
            <p className="text-muted">
              Entrez un terme de recherche pour découvrir les brevets et technologies de la NASA.
            </p>
          </Card.Body>
        </Card>
      )}

      {/* Informations sur Tech Transfer */}
      <Row className="mt-4">
        <Col md={6}>
          <Card className="nasa-card">
            <Card.Header>
              <h5>À propos du Tech Transfer</h5>
            </Card.Header>
            <Card.Body>
              <p>
                Le programme de transfert technologique de la NASA permet aux entreprises 
                et organisations d'accéder aux innovations développées par l'agence spatiale.
              </p>
              <ul>
                <li>Brevets disponibles pour licence</li>
                <li>Technologies spatiales avancées</li>
                <li>Applications terrestres</li>
                <li>Support technique disponible</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="nasa-card">
            <Card.Header>
              <h5>Catégories de technologies</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap gap-2">
                <Badge bg="primary">Aeronautics</Badge>
                <Badge bg="success">Space Technology</Badge>
                <Badge bg="info">Earth Science</Badge>
                <Badge bg="warning">Human Exploration</Badge>
                <Badge bg="secondary">Science</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TechTransferPage; 