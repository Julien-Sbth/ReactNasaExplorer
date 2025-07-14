import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FaCalendar, FaInfo, FaDownload, FaShare } from 'react-icons/fa';
import { apodService, formatDate } from '../services/nasaApi';

const ApodPage = () => {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [isRandom, setIsRandom] = useState(false);

  // Query pour l'image du jour
  const { data: apodData, isLoading, error, refetch } = useQuery(
    ['apod', selectedDate],
    () => apodService.getByDate(selectedDate),
    {
      enabled: !isRandom,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Query pour les images aléatoires
  const { data: randomData, isLoading: randomLoading, refetch: refetchRandom } = useQuery(
    ['apod-random'],
    () => apodService.getRandom(1),
    {
      enabled: isRandom,
      staleTime: 5 * 60 * 1000,
    }
  );

  const currentData = isRandom ? randomData : apodData;
  const currentLoading = isRandom ? randomLoading : isLoading;

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsRandom(false);
  };

  const handleRandomClick = () => {
    setIsRandom(true);
    refetchRandom();
  };

  const handleTodayClick = () => {
    setSelectedDate(formatDate(new Date()));
    setIsRandom(false);
    refetch();
  };

  const shareImage = () => {
    if (navigator.share && currentData?.data) {
      navigator.share({
        title: currentData.data.title,
        text: currentData.data.explanation,
        url: currentData.data.url,
      });
    } else {
      // Fallback: copier l'URL dans le presse-papiers
      navigator.clipboard.writeText(currentData.data.url);
      alert('URL copiée dans le presse-papiers !');
    }
  };

  if (error) {
    return (
      <Container className="page-container">
        <Helmet>
          <title>APOD - Image du Jour | NASA Data Explorer</title>
        </Helmet>
        
        <div className="page-header">
          <h1 className="page-title">APOD - Image du Jour</h1>
          <p className="page-description">
            Découvrez l'image astronomique du jour de la NASA avec des explications détaillées.
          </p>
        </div>

        <Alert variant="danger" className="error-container">
          <FaInfo className="error-icon" />
          <h4>Erreur lors du chargement</h4>
          <p className="error-message">
            {error.message || 'Impossible de récupérer l\'image du jour. Veuillez réessayer.'}
          </p>
          <Button onClick={() => refetch()} className="btn-nasa">
            Réessayer
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="page-container">
      <Helmet>
        <title>APOD - Image du Jour | NASA Data Explorer</title>
        <meta name="description" content="Découvrez l'image astronomique du jour de la NASA avec des explications détaillées." />
      </Helmet>

      <div className="page-header">
        <h1 className="page-title">APOD - Image du Jour</h1>
        <p className="page-description">
          Découvrez l'image astronomique du jour de la NASA avec des explications détaillées.
        </p>
      </div>

      {/* Contrôles */}
      <Card className="nasa-card mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={4}>
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
            <Col md={4} className="text-center">
              <Button 
                onClick={handleTodayClick}
                className="btn-nasa me-2"
                disabled={currentLoading}
              >
                Aujourd'hui
              </Button>
              <Button 
                onClick={handleRandomClick}
                className="btn-mars"
                disabled={currentLoading}
              >
                Aléatoire
              </Button>
            </Col>
            <Col md={4} className="text-end">
              {currentData?.data && (
                <div>
                  <Button 
                    onClick={shareImage}
                    variant="outline-light"
                    className="me-2"
                    size="sm"
                  >
                    <FaShare className="me-1" />
                    Partager
                  </Button>
                  <Button 
                    href={currentData.data.hdurl || currentData.data.url}
                    target="_blank"
                    variant="outline-light"
                    size="sm"
                  >
                    <FaDownload className="me-1" />
                    Télécharger
                  </Button>
                </div>
              )}
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
          <p className="loading-text">Chargement de l'image du jour...</p>
        </div>
      ) : currentData?.data ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Row>
            <Col lg={8}>
              <Card className="nasa-card mb-4">
                <Card.Body className="p-0">
                  {currentData.data.media_type === 'image' ? (
                    <img
                      src={currentData.data.url}
                      alt={currentData.data.title}
                      className="nasa-image w-100"
                      style={{ maxHeight: '600px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="video-container">
                      <iframe
                        src={currentData.data.url}
                        title={currentData.data.title}
                        width="100%"
                        height="400"
                        frameBorder="0"
                        allowFullScreen
                      />
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4}>
              <Card className="nasa-card">
                <Card.Header>
                  <h3>{currentData.data.title}</h3>
                </Card.Header>
                <Card.Body>
                  <p className="text-muted mb-3">
                    <strong>Date :</strong> {new Date(currentData.data.date).toLocaleDateString('fr-FR')}
                  </p>
                  
                  {currentData.data.copyright && (
                    <p className="text-muted mb-3">
                      <strong>Copyright :</strong> {currentData.data.copyright}
                    </p>
                  )}
                  
                  <p className="mb-3">
                    {currentData.data.explanation}
                  </p>
                  
                  {currentData.data.hdurl && (
                    <Button 
                      href={currentData.data.hdurl}
                      target="_blank"
                      className="btn-nasa w-100 mb-2"
                    >
                      <FaDownload className="me-2" />
                      Version HD
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </motion.div>
      ) : (
        <Alert variant="info" className="text-center">
          <FaInfo className="me-2" />
          Aucune image trouvée pour cette date.
        </Alert>
      )}
    </Container>
  );
};

export default ApodPage; 