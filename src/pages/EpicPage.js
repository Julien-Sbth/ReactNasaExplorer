import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FaGlobe, FaCalendar, FaInfo } from 'react-icons/fa';
import { epicService, formatDate } from '../services/nasaApi';

const EpicPage = () => {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  // Query pour les images EPIC récentes
  const { data: recentData, isLoading: recentLoading, error: recentError } = useQuery(
    ['epic-recent'],
    () => epicService.getRecent(),
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  // Query pour les images par date
  const { data: dateData, isLoading: dateLoading, error: dateError } = useQuery(
    ['epic-date', selectedDate],
    () => epicService.getByDate(selectedDate),
    {
      enabled: !!selectedDate,
      staleTime: 5 * 60 * 1000,
    }
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTodayClick = () => {
    setSelectedDate(formatDate(new Date()));
  };

  const currentData = dateData || recentData;
  const currentLoading = dateLoading || recentLoading;
  const currentError = dateError || recentError;

  return (
    <Container className="page-container">
      <Helmet>
        <title>Images de la Terre | NASA Data Explorer</title>
        <meta name="description" content="Admirez notre planète depuis l'espace avec les images EPIC de la NASA." />
      </Helmet>

      <div className="page-header">
        <h1 className="page-title">Images de la Terre</h1>
        <p className="page-description">
          Admirez notre planète depuis l'espace avec les images EPIC (Earth Polychromatic Imaging Camera).
        </p>
      </div>

      {/* Contrôles */}
      <Card className="nasa-card mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  <FaCalendar className="me-2" />
                  Sélectionner une date
                </Form.Label>
                <Form.Control
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="nasa-form-control"
                  max={formatDate(new Date())}
                />
              </Form.Group>
            </Col>
            <Col md={3} className="text-center">
              <Button 
                onClick={handleTodayClick}
                className="btn-nasa w-100"
                disabled={currentLoading}
              >
                Aujourd'hui
              </Button>
            </Col>
            <Col md={3} className="text-end">
              <Button 
                onClick={() => setSelectedDate(formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000)))}
                className="btn-mars w-100"
                disabled={currentLoading}
              >
                Hier
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Contenu principal */}
      {currentLoading ? (
        <div className="nasa-loader">
          <div className="spinner-border spinner-border-nasa" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="loading-text">Chargement des images de la Terre...</p>
        </div>
      ) : currentError ? (
        <Alert variant="danger" className="error-container">
          <FaInfo className="error-icon" />
          <h4>Erreur lors du chargement</h4>
          <p className="error-message">
            {currentError.message || 'Impossible de récupérer les images de la Terre.'}
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
                Images EPIC - {new Date(selectedDate).toLocaleDateString('fr-FR')}
                <span className="badge bg-info ms-2">
                  {currentData.data.length} images
                </span>
              </h3>
            </Card.Header>
            <Card.Body>
              {currentData.data.length > 0 ? (
                <div className="image-gallery">
                  {currentData.data.map((image) => (
                    <Card key={image.identifier} className="nasa-card photo-card">
                      <Card.Body className="p-0">
                        <img
                          src={epicService.getImageUrl(image.date, image.image)}
                          alt={`EPIC ${image.identifier}`}
                          className="nasa-image w-100"
                          style={{ height: '250px', objectFit: 'cover' }}
                        />
                        <div className="p-3">
                          <h6>Image #{image.identifier}</h6>
                          <p className="text-muted mb-2">
                            <strong>Date:</strong> {new Date(image.date).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-muted mb-2">
                            <strong>Heure:</strong> {image.caption}
                          </p>
                          <p className="text-muted mb-2">
                            <strong>Version:</strong> {image.version}
                          </p>
                          <Button
                            href={epicService.getImageUrl(image.date, image.image)}
                            target="_blank"
                            variant="outline-primary"
                            size="sm"
                            className="w-100"
                          >
                            <FaGlobe className="me-1" />
                            Voir en grand
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert variant="info" className="text-center">
                  <FaInfo className="me-2" />
                  Aucune image trouvée pour cette date.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </motion.div>
      ) : (
        <Alert variant="info" className="text-center">
          <FaInfo className="me-2" />
          Aucune image disponible pour le moment.
        </Alert>
      )}
    </Container>
  );
};

export default EpicPage; 