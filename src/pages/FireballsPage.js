import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { Fire, Search, Calendar, GeoAlt, Speedometer, Thermometer } from 'react-bootstrap-icons';
import { fireballsService } from '../services/nasaApi';

const FireballsPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minEnergy, setMinEnergy] = useState('');
  const [page, setPage] = useState(1);

  const {
    data: fireballsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['fireballs', startDate, endDate, minEnergy, page],
    queryFn: () => fireballsService.getFireballs({
      start_date: startDate,
      end_date: endDate,
      min_energy: minEnergy,
      page: page,
      limit: 20
    }),
    enabled: !!startDate && !!endDate,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleLastWeek = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const handleLastMonth = () => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Heure inconnue';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEnergyColor = (energy) => {
    if (!energy) return 'light';
    if (energy < 1) return 'success';
    if (energy < 10) return 'warning';
    if (energy < 100) return 'danger';
    return 'dark';
  };

  const getVelocityColor = (velocity) => {
    if (!velocity) return 'light';
    if (velocity < 20) return 'success';
    if (velocity < 40) return 'warning';
    return 'danger';
  };

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Erreur lors du chargement</Alert.Heading>
          <p>{error.message || 'Une erreur s\'est produite lors de la récupération des données de bolides.'}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-vh-100"
    >
      <Container className="py-5">
        <Row className="mb-5">
          <Col>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="display-4 text-center mb-3">
                <Fire className="me-3" />
                Bolides (Fireballs)
              </h1>
              <p className="lead text-center text-muted">
                Découvrez les bolides détectés par les réseaux de surveillance de la NASA
              </p>
            </motion.div>
          </Col>
        </Row>

        {/* Formulaire de recherche */}
        <Row className="mb-5">
          <Col lg={10} className="mx-auto">
            <Card className="shadow-sm">
              <Card.Body>
                <Form onSubmit={handleSearch}>
                  <Row>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <Calendar className="me-2" />
                          Date début
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <Calendar className="me-2" />
                          Date fin
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <Thermometer className="me-2" />
                          Énergie min. (kt)
                        </Form.Label>
                        <Form.Control
                          type="number"
                          step="0.1"
                          placeholder="0.1"
                          value={minEnergy}
                          onChange={(e) => setMinEnergy(e.target.value)}
                          min="0"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3} className="d-flex align-items-end">
                      <div className="d-flex gap-2 w-100">
                        <Button
                          type="submit"
                          variant="primary"
                          className="flex-fill"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Recherche...
                            </>
                          ) : (
                            <>
                              <Search className="me-2" />
                              Rechercher
                            </>
                          )}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="text-center">
                      <Button
                        variant="outline-secondary"
                        onClick={handleLastWeek}
                        className="me-2"
                      >
                        Dernière semaine
                      </Button>
                      <Button
                        variant="outline-info"
                        onClick={handleLastMonth}
                      >
                        Dernier mois
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Statistiques */}
        {fireballsData && (
          <Row className="mb-4">
            <Col>
              <Card className="bg-light">
                <Card.Body>
                  <Row className="text-center">
                    <Col md={3}>
                      <h4 className="text-primary">{fireballsData.total || 0}</h4>
                      <small className="text-muted">Total bolides</small>
                    </Col>
                    <Col md={3}>
                      <h4 className="text-success">{fireballsData.avg_energy || 'N/A'}</h4>
                      <small className="text-muted">Énergie moyenne (kt)</small>
                    </Col>
                    <Col md={3}>
                      <h4 className="text-warning">{fireballsData.max_energy || 'N/A'}</h4>
                      <small className="text-muted">Énergie max (kt)</small>
                    </Col>
                    <Col md={3}>
                      <h4 className="text-info">{fireballsData.avg_velocity || 'N/A'}</h4>
                      <small className="text-muted">Vitesse moyenne (km/s)</small>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Résultats */}
        {fireballsData && fireballsData.fireballs && (
          <Row>
            <Col>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>
                  Bolides détectés ({fireballsData.fireballs.length} affichés)
                </h3>
                <Badge bg="info" className="me-2">
                  Page {page}
                </Badge>
              </div>

              <Row>
                {fireballsData.fireballs.map((fireball, index) => (
                  <Col key={fireball.id} lg={6} className="mb-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-100 shadow-sm hover-lift">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <Card.Title className="h5 mb-1">
                                Bolide #{fireball.id || 'Inconnu'}
                              </Card.Title>
                              <Card.Subtitle className="text-muted">
                                {formatDate(fireball.date)} à {formatTime(fireball.time)}
                              </Card.Subtitle>
                            </div>
                            <div className="text-end">
                              {fireball.energy && (
                                <Badge bg={getEnergyColor(fireball.energy)} className="mb-1">
                                  {fireball.energy} kt
                                </Badge>
                              )}
                              {fireball.velocity && (
                                <Badge bg={getVelocityColor(fireball.velocity)}>
                                  {fireball.velocity} km/s
                                </Badge>
                              )}
                            </div>
                          </div>

                          <Row className="mb-3">
                            <Col md={6}>
                              <small className="text-muted d-block">
                                <GeoAlt className="me-1" />
                                Lat: {fireball.latitude || 'N/A'}°
                              </small>
                              <small className="text-muted d-block">
                                <GeoAlt className="me-1" />
                                Lon: {fireball.longitude || 'N/A'}°
                              </small>
                            </Col>
                            <Col md={6}>
                              <small className="text-muted d-block">
                                <Speedometer className="me-1" />
                                Vitesse: {fireball.velocity || 'N/A'} km/s
                              </small>
                              <small className="text-muted d-block">
                                <Thermometer className="me-1" />
                                Énergie: {fireball.energy || 'N/A'} kt
                              </small>
                            </Col>
                          </Row>

                          {fireball.altitude && (
                            <div className="mb-2">
                              <small className="text-muted">Altitude:</small>
                              <div className="mt-1">
                                <Badge bg="light" text="dark" className="me-1">
                                  Entrée: {fireball.altitude_entry || 'N/A'} km
                                </Badge>
                                <Badge bg="light" text="dark">
                                  Sortie: {fireball.altitude_exit || 'N/A'} km
                                </Badge>
                              </div>
                            </div>
                          )}

                          {fireball.radiated_energy && (
                            <div className="mb-2">
                              <small className="text-muted">Énergie rayonnée:</small>
                              <div className="mt-1">
                                <Badge bg="warning" className="me-1">
                                  {fireball.radiated_energy} × 10¹⁰ J
                                </Badge>
                              </div>
                            </div>
                          )}

                          {fireball.impact_energy && (
                            <div className="mb-2">
                              <small className="text-muted">Énergie d'impact:</small>
                              <div className="mt-1">
                                <Badge bg="danger" className="me-1">
                                  {fireball.impact_energy} kt TNT
                                </Badge>
                              </div>
                            </div>
                          )}

                          {fireball.description && (
                            <Card.Text className="small text-muted mt-2">
                              {fireball.description.length > 100 
                                ? fireball.description.substring(0, 100) + '...'
                                : fireball.description
                              }
                            </Card.Text>
                          )}
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>

              {/* Bouton "Charger plus" */}
              {fireballsData.fireballs.length >= 20 && (
                <Row className="mt-4">
                  <Col className="text-center">
                    <Button
                      variant="outline-primary"
                      onClick={handleLoadMore}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Chargement...
                        </>
                      ) : (
                        'Charger plus de bolides'
                      )}
                    </Button>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        )}

        {/* Message d'accueil si aucune donnée */}
        {!fireballsData && !isLoading && (
          <Row>
            <Col className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Fire size={64} className="text-muted mb-3" />
                <h4>Découvrez les bolides détectés</h4>
                <p className="text-muted">
                  Entrez une période pour voir les bolides détectés par les réseaux de surveillance
                </p>
              </motion.div>
            </Col>
          </Row>
        )}
      </Container>
    </motion.div>
  );
};

export default FireballsPage; 