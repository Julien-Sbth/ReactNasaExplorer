import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FaCloudSun, FaInfo, FaExclamationTriangle } from 'react-icons/fa';
import { donkiService, getDateRange } from '../services/nasaApi';

const DonkiPage = () => {
  const [dateRange, setDateRange] = useState(getDateRange(7));
  const [activeTab, setActiveTab] = useState('cme');

  // Query pour les CME (Coronal Mass Ejections)
  const { data: cmeData, isLoading: cmeLoading, error: cmeError } = useQuery(
    ['donki-cme', dateRange],
    () => donkiService.getCME(dateRange.startDate, dateRange.endDate),
    {
      enabled: activeTab === 'cme',
      staleTime: 5 * 60 * 1000,
    }
  );

  // Query pour les éruptions solaires
  const { data: flareData, isLoading: flareLoading, error: flareError } = useQuery(
    ['donki-flare', dateRange],
    () => donkiService.getSolarFlare(dateRange.startDate, dateRange.endDate),
    {
      enabled: activeTab === 'flare',
      staleTime: 5 * 60 * 1000,
    }
  );

  const currentData = activeTab === 'cme' ? cmeData : flareData;
  const currentLoading = activeTab === 'cme' ? cmeLoading : flareLoading;
  const currentError = activeTab === 'cme' ? cmeError : flareError;

  const getSeverityBadge = (severity) => {
    const severityMap = {
      'Minor': 'success',
      'Moderate': 'warning',
      'Strong': 'danger',
      'Severe': 'danger',
      'Extreme': 'danger',
    };
    return severityMap[severity] || 'secondary';
  };

  return (
    <Container className="page-container">
      <Helmet>
        <title>Météo Spatiale | NASA Data Explorer</title>
        <meta name="description" content="Surveillez les événements météorologiques spatiaux avec DONKI." />
      </Helmet>

      <div className="page-header">
        <h1 className="page-title">Météo Spatiale</h1>
        <p className="page-description">
          Surveillez les événements météorologiques spatiaux avec DONKI (Database of Notifications, Knowledge, Information).
        </p>
      </div>

      {/* Onglets */}
      <Card className="nasa-card mb-4">
        <Card.Body>
          <div className="d-flex justify-content-center mb-3">
            <Button
              variant={activeTab === 'cme' ? 'primary' : 'outline-primary'}
              className="me-2"
              onClick={() => setActiveTab('cme')}
            >
              <FaExclamationTriangle className="me-2" />
              Éjections de Masse Coronale (CME)
            </Button>
            <Button
              variant={activeTab === 'flare' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('flare')}
            >
              <FaCloudSun className="me-2" />
              Éruptions Solaires
            </Button>
          </div>

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
        </Card.Body>
      </Card>

      {/* Contenu */}
      {currentLoading ? (
        <div className="nasa-loader">
          <div className="spinner-border spinner-border-nasa" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="loading-text">Chargement des données météorologiques spatiales...</p>
        </div>
      ) : currentError ? (
        <Alert variant="danger" className="error-container">
          <FaInfo className="error-icon" />
          <h4>Erreur lors du chargement</h4>
          <p className="error-message">
            {currentError.message || 'Impossible de récupérer les données météorologiques spatiales.'}
          </p>
        </Alert>
      ) : currentData?.data ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="nasa-card">
            <Card.Header>
              <h3>
                {activeTab === 'cme' ? 'Éjections de Masse Coronale' : 'Éruptions Solaires'}
                <Badge bg="info" className="ms-2">
                  {currentData.data.length} événements
                </Badge>
              </h3>
            </Card.Header>
            <Card.Body>
              {currentData.data.length > 0 ? (
                <div className="row">
                  {currentData.data.map((event, index) => (
                    <Col key={index} md={6} lg={4} className="mb-3">
                      <Card className="nasa-card h-100">
                        <Card.Body>
                          <h6 className="card-title">
                            {activeTab === 'cme' ? `CME ${event.activityID}` : `Flare ${event.flareID}`}
                          </h6>
                          
                          {activeTab === 'cme' ? (
                            <>
                              <p><strong>Date:</strong> {new Date(event.beginTime).toLocaleDateString('fr-FR')}</p>
                              <p><strong>Type:</strong> {event.cmeAnalyses?.[0]?.type || 'N/A'}</p>
                              <p><strong>Vitesse:</strong> {event.cmeAnalyses?.[0]?.speed || 'N/A'} km/s</p>
                              <p><strong>Largeur:</strong> {event.cmeAnalyses?.[0]?.width || 'N/A'}°</p>
                            </>
                          ) : (
                            <>
                              <p><strong>Date:</strong> {new Date(event.beginTime).toLocaleDateString('fr-FR')}</p>
                              <p><strong>Classe:</strong> 
                                <Badge bg={getSeverityBadge(event.classType)} className="ms-2">
                                  {event.classType}
                                </Badge>
                              </p>
                              <p><strong>Source:</strong> {event.sourceLocation || 'N/A'}</p>
                              <p><strong>Intensité:</strong> {event.intensity || 'N/A'}</p>
                            </>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </div>
              ) : (
                <Alert variant="info" className="text-center">
                  <FaInfo className="me-2" />
                  Aucun événement trouvé pour cette période.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </motion.div>
      ) : (
        <Alert variant="info" className="text-center">
          <FaInfo className="me-2" />
          Aucune donnée météorologique spatiale disponible pour le moment.
        </Alert>
      )}
    </Container>
  );
};

export default DonkiPage; 