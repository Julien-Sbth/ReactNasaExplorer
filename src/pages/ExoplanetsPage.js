import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, Badge, Form } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FaSearch, FaInfo, FaStar } from 'react-icons/fa';
import { exoplanetsService } from '../services/nasaApi';

const ExoplanetsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('confirmed');
  const [showAll, setShowAll] = useState(false);

  // Query pour les exoplanètes confirmées
  const { data: confirmedData, isLoading: confirmedLoading, error: confirmedError } = useQuery(
    ['exoplanets-confirmed'],
    () => exoplanetsService.getConfirmed(),
    {
      enabled: activeTab === 'confirmed',
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Query pour les candidats Kepler
  const { data: keplerData, isLoading: keplerLoading, error: keplerError } = useQuery(
    ['exoplanets-kepler'],
    () => exoplanetsService.getKepler(),
    {
      enabled: activeTab === 'kepler',
      staleTime: 10 * 60 * 1000,
    }
  );

  const currentData = activeTab === 'confirmed' ? confirmedData : keplerData;
  const currentLoading = activeTab === 'confirmed' ? confirmedLoading : keplerLoading;
  const currentError = activeTab === 'confirmed' ? confirmedError : keplerError;

  // Filtrer les données selon le terme de recherche
  let filteredData = Array.isArray(currentData?.data) ? currentData.data : [];
  if (searchTerm.trim() !== "" && !showAll) {
    filteredData = filteredData.filter(planet =>
      planet.pl_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planet.hostname?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }
    return value;
  };

  const getPlanetType = (mass, radius) => {
    if (!mass || !radius) return 'Inconnu';
    
    const massValue = parseFloat(mass);
    
    if (massValue < 0.1) return 'Planète terrestre';
    if (massValue < 10) return 'Géante gazeuse';
    if (massValue < 13) return 'Naine brune';
    return 'Étoile';
  };

  return (
    <Container className="page-container">
      <Helmet>
        <title>Exoplanètes | NASA Data Explorer</title>
        <meta name="description" content="Découvrez les planètes extrasolaires confirmées et leurs propriétés." />
      </Helmet>

      {/* Debug: Show raw JSON response from API */}
      <Card className="mb-3">
        <Card.Body>
          <strong>DEBUG: Raw API Response</strong>
          <pre style={{ maxHeight: 300, overflow: 'auto', fontSize: '0.85em', background: '#222', color: '#fff', padding: 10, borderRadius: 8 }}>
            {JSON.stringify(currentData, null, 2)}
          </pre>
        </Card.Body>
      </Card>

      <div className="page-header">
        <h1 className="page-title">Exoplanètes</h1>
        <p className="page-description">
          Découvrez les planètes extrasolaires confirmées et leurs propriétés fascinantes.
        </p>
      </div>

      {/* Onglets */}
      <Card className="nasa-card mb-4">
        <Card.Body>
          <div className="d-flex justify-content-center mb-3">
            <Button
              variant={activeTab === 'confirmed' ? 'primary' : 'outline-primary'}
              className="me-2"
              onClick={() => setActiveTab('confirmed')}
            >
              <FaStar className="me-2" />
              Exoplanètes Confirmées
            </Button>
            <Button
              variant={activeTab === 'kepler' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('kepler')}
            >
              <FaSearch className="me-2" />
              Candidats Kepler
            </Button>
          </div>

          <Row>
            <Col md={8}>
              <Form.Group>
                <Form.Label>Rechercher une exoplanète</Form.Label>
                <Form.Control
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nom de la planète ou de l'étoile hôte..."
                  className="nasa-form-control"
                />
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end justify-content-end">
              <Form.Check
                type="checkbox"
                id="show-all-exoplanets"
                label="Show all exoplanets"
                checked={showAll}
                onChange={e => setShowAll(e.target.checked)}
                className="ms-3"
              />
              <Badge bg="info" className="p-2 ms-3">
                {filteredData.length} résultats
              </Badge>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Contenu */}
      {currentLoading ? (
        <div className="nasa-loader">
          <div className="spinner-border spinner-border-nasa" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="loading-text">Chargement des données d'exoplanètes...</p>
        </div>
      ) : currentError ? (
        <Alert variant="danger" className="error-container">
          <FaInfo className="error-icon" />
          <h4>Erreur lors du chargement</h4>
          <p className="error-message">
            {currentError.message || 'Impossible de récupérer les données d\'exoplanètes.'}
          </p>
        </Alert>
      ) : filteredData.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="nasa-card">
            <Card.Header>
              <h3>
                {activeTab === 'confirmed' ? 'Exoplanètes Confirmées' : 'Candidats Kepler'}
                <Badge bg="success" className="ms-2">
                  {filteredData.length} planètes
                </Badge>
              </h3>
            </Card.Header>
            <Card.Body>
              <Table responsive className="nasa-table">
                <thead>
                  <tr>
                    <th>Planète</th>
                    <th>Étoile Hôte</th>
                    <th>Type</th>
                    <th>Masse (M⊕)</th>
                    <th>Rayon (R⊕)</th>
                    <th>Période (jours)</th>
                    <th>Distance (pc)</th>
                    <th>Température (K)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice(0, 100).map((planet, index) => (
                    <tr key={index}>
                      <td>
                        <strong>{formatValue(planet.pl_name)}</strong>
                        {planet.pl_letter && (
                          <Badge bg="secondary" className="ms-1">
                            {planet.pl_letter}
                          </Badge>
                        )}
                      </td>
                      <td>{formatValue(planet.hostname)}</td>
                      <td>
                        <Badge bg="info">
                          {getPlanetType(planet.pl_masse, planet.pl_rade)}
                        </Badge>
                      </td>
                      <td>{formatValue(planet.pl_masse)}</td>
                      <td>{formatValue(planet.pl_rade)}</td>
                      <td>{formatValue(planet.pl_orbper)}</td>
                      <td>{formatValue(planet.sy_dist)}</td>
                      <td>{formatValue(planet.pl_eqt)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {filteredData.length > 100 && (
                <div className="text-center mt-3">
                  <Alert variant="info">
                    Affichage des 100 premiers résultats sur {filteredData.length} planètes.
                  </Alert>
                </div>
              )}
            </Card.Body>
          </Card>
        </motion.div>
      ) : searchTerm ? (
        <Alert variant="info" className="text-center">
          <FaInfo className="me-2" />
          Aucune exoplanète trouvée avec ce terme de recherche.
        </Alert>
      ) : (
        <Alert variant="info" className="text-center">
          <FaInfo className="me-2" />
          Aucune donnée d'exoplanète disponible pour le moment.
        </Alert>
      )}

      {/* Statistiques */}
      {Array.isArray(currentData?.data) && (
        <Row className="mt-4">
          <Col md={4}>
            <Card className="nasa-card text-center">
              <Card.Body>
                <h4>{currentData.data.length}</h4>
                <p>Total des planètes</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="nasa-card text-center">
              <Card.Body>
                <h4>
                  {currentData.data.filter(p => p.pl_masse && parseFloat(p.pl_masse) < 10).length}
                </h4>
                <p>Géantes gazeuses</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="nasa-card text-center">
              <Card.Body>
                <h4>
                  {currentData.data.filter(p => p.pl_masse && parseFloat(p.pl_masse) < 0.1).length}
                </h4>
                <p>Planètes terrestres</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ExoplanetsPage; 