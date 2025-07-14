import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Alert, Badge } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FaSearch, FaInfo, FaExclamationTriangle, FaRocket } from 'react-icons/fa';
import { neoService, getDateRange } from '../services/nasaApi';

const NeoPage = () => {
  const [dateRange, setDateRange] = useState(getDateRange(7));
  const [searchId, setSearchId] = useState('');
  const [activeTab, setActiveTab] = useState('feed');

  // Query pour le feed NEO
  const { data: feedData, isLoading: feedLoading, error: feedError } = useQuery(
    ['neo-feed', dateRange],
    () => neoService.getFeed(dateRange.startDate, dateRange.endDate),
    {
      enabled: activeTab === 'feed',
      staleTime: 5 * 60 * 1000,
    }
  );

  // Query pour la recherche par ID
  const { data: lookupData, isLoading: lookupLoading, error: lookupError, refetch: refetchLookup } = useQuery(
    ['neo-lookup', searchId],
    () => neoService.lookup(searchId),
    {
      enabled: activeTab === 'lookup' && searchId.length > 0,
      staleTime: 5 * 60 * 1000,
    }
  );

  const handleSearch = () => {
    if (searchId.trim()) {
      refetchLookup();
    }
  };

  const getHazardousBadge = (isHazardous) => {
    return isHazardous ? (
      <Badge bg="danger" className="me-2">
        <FaExclamationTriangle className="me-1" />
        Dangereux
      </Badge>
    ) : (
      <Badge bg="success" className="me-2">
        Sûr
      </Badge>
    );
  };

  const formatDistance = (distance) => {
    return `${parseFloat(distance).toFixed(2)} km`;
  };

  const formatVelocity = (velocity) => {
    return `${parseFloat(velocity).toFixed(2)} km/h`;
  };

  return (
    <Container className="page-container">
      <Helmet>
        <title>Astéroïdes NEO | NASA Data Explorer</title>
        <meta name="description" content="Suivez les objets géocroiseurs et les astéroïdes proches de la Terre." />
      </Helmet>

      <div className="page-header">
        <h1 className="page-title">Astéroïdes NEO</h1>
        <p className="page-description">
          Suivez les objets géocroiseurs et les astéroïdes proches de la Terre.
        </p>
      </div>

      {/* Onglets */}
      <Card className="nasa-card mb-4">
        <Card.Body>
          <div className="d-flex justify-content-center mb-3">
            <Button
              variant={activeTab === 'feed' ? 'primary' : 'outline-primary'}
              className="me-2"
              onClick={() => setActiveTab('feed')}
            >
              <FaRocket className="me-2" />
              Feed Récent
            </Button>
            <Button
              variant={activeTab === 'lookup' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('lookup')}
            >
              <FaSearch className="me-2" />
              Recherche par ID
            </Button>
          </div>

          {activeTab === 'feed' && (
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date de début</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                    className="nasa-form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date de fin</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                    className="nasa-form-control"
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          {activeTab === 'lookup' && (
            <Row>
              <Col md={8}>
                <Form.Group>
                  <Form.Label>ID de l'astéroïde</Form.Label>
                  <Form.Control
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Ex: 3542519"
                    className="nasa-form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex align-items-end">
                <Button onClick={handleSearch} className="btn-nasa w-100" disabled={!searchId.trim()}>
                  <FaSearch className="me-2" />
                  Rechercher
                </Button>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Contenu */}
      {activeTab === 'feed' && (
        <>
          {feedLoading ? (
            <div className="nasa-loader">
              <div className="spinner-border spinner-border-nasa" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="loading-text">Chargement des données d'astéroïdes...</p>
            </div>
          ) : feedError ? (
            <Alert variant="danger" className="error-container">
              <FaInfo className="error-icon" />
              <h4>Erreur lors du chargement</h4>
              <p className="error-message">
                {feedError.message || 'Impossible de récupérer les données d\'astéroïdes.'}
              </p>
            </Alert>
          ) : feedData?.data ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="nasa-card">
                <Card.Header>
                  <h3>Astéroïdes détectés du {dateRange.startDate} au {dateRange.endDate}</h3>
                </Card.Header>
                <Card.Body>
                  <Table responsive className="nasa-table">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Diamètre (km)</th>
                        <th>Distance (km)</th>
                        <th>Vitesse (km/h)</th>
                        <th>Statut</th>
                        <th>Date d'approche</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(feedData.data.near_earth_objects).map(([date, asteroids]) =>
                        asteroids.map((asteroid) => (
                          <tr key={asteroid.id}>
                            <td>
                              <strong>{asteroid.name}</strong>
                              <br />
                              <small className="text-muted">ID: {asteroid.id}</small>
                            </td>
                            <td>
                              {asteroid.estimated_diameter?.kilometers?.estimated_diameter_min?.toFixed(2)} - 
                              {asteroid.estimated_diameter?.kilometers?.estimated_diameter_max?.toFixed(2)}
                            </td>
                            <td>
                              {formatDistance(asteroid.close_approach_data[0]?.miss_distance?.kilometers)}
                            </td>
                            <td>
                              {formatVelocity(asteroid.close_approach_data[0]?.relative_velocity?.kilometers_per_hour)}
                            </td>
                            <td>
                              {getHazardousBadge(asteroid.is_potentially_hazardous_asteroid)}
                            </td>
                            <td>
                              {new Date(asteroid.close_approach_data[0]?.close_approach_date).toLocaleDateString('fr-FR')}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </motion.div>
          ) : (
            <Alert variant="info" className="text-center">
              <FaInfo className="me-2" />
              Aucune donnée d'astéroïde trouvée pour cette période.
            </Alert>
          )}
        </>
      )}

      {activeTab === 'lookup' && (
        <>
          {lookupLoading ? (
            <div className="nasa-loader">
              <div className="spinner-border spinner-border-nasa" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="loading-text">Recherche de l'astéroïde...</p>
            </div>
          ) : lookupError ? (
            <Alert variant="danger" className="error-container">
              <FaInfo className="error-icon" />
              <h4>Erreur lors de la recherche</h4>
              <p className="error-message">
                {lookupError.message || 'Impossible de trouver cet astéroïde.'}
              </p>
            </Alert>
          ) : lookupData?.data ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="nasa-card">
                <Card.Header>
                  <h3>Détails de l'astéroïde</h3>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <h4>{lookupData.data.name}</h4>
                      <p><strong>ID:</strong> {lookupData.data.id}</p>
                      <p><strong>Diamètre estimé:</strong> {lookupData.data.estimated_diameter?.kilometers?.estimated_diameter_min?.toFixed(2)} - {lookupData.data.estimated_diameter?.kilometers?.estimated_diameter_max?.toFixed(2)} km</p>
                      <p><strong>Statut:</strong> {getHazardousBadge(lookupData.data.is_potentially_hazardous_asteroid)}</p>
                    </Col>
                    <Col md={6}>
                      <h5>Dernière approche</h5>
                      {lookupData.data.close_approach_data?.map((approach, index) => (
                        <div key={index} className="mb-2">
                          <p><strong>Date:</strong> {new Date(approach.close_approach_date).toLocaleDateString('fr-FR')}</p>
                          <p><strong>Distance:</strong> {formatDistance(approach.miss_distance.kilometers)}</p>
                          <p><strong>Vitesse:</strong> {formatVelocity(approach.relative_velocity.kilometers_per_hour)}</p>
                        </div>
                      ))}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </motion.div>
          ) : searchId && (
            <Alert variant="info" className="text-center">
              <FaInfo className="me-2" />
              Aucun astéroïde trouvé avec cet ID.
            </Alert>
          )}
        </>
      )}
    </Container>
  );
};

export default NeoPage; 