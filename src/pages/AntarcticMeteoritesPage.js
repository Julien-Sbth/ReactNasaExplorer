import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { Snow, Search, Calendar, GeoAlt, InfoCircle, Globe } from 'react-bootstrap-icons';
import { antarcticMeteoritesService } from '../services/nasaApi';

const AntarcticMeteoritesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [meteoriteType, setMeteoriteType] = useState('');
  const [yearFound, setYearFound] = useState('');
  const [page, setPage] = useState(1);

  const {
    data: meteoritesData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['antarcticMeteorites', searchQuery, meteoriteType, yearFound, page],
    queryFn: () => antarcticMeteoritesService.getMeteorites({
      search: searchQuery,
      meteorite_type: meteoriteType,
      year_found: yearFound,
      page: page,
      limit: 20
    }),
    enabled: true,
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getMeteoriteTypeColor = (type) => {
    const colors = {
      'H': 'primary',      // H chondrite
      'L': 'success',      // L chondrite
      'LL': 'warning',     // LL chondrite
      'C': 'info',         // Carbonaceous chondrite
      'E': 'secondary',    // Enstatite chondrite
      'R': 'dark',         // Rumuruti chondrite
      'Iron': 'danger',    // Iron meteorite
      'Stony-iron': 'purple' // Stony-iron meteorite
    };
    return colors[type] || 'light';
  };

  const getYearColor = (year) => {
    if (!year) return 'light';
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    if (age < 10) return 'success';
    if (age < 30) return 'warning';
    return 'info';
  };

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Erreur lors du chargement</Alert.Heading>
          <p>{error.message || 'Une erreur s\'est produite lors de la récupération des météorites antarctiques.'}</p>
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
                <Snow className="me-3" />
                Météorites Antarctiques
              </h1>
              <p className="lead text-center text-muted">
                Explorez la collection de météorites découvertes en Antarctique
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
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <Search className="me-2" />
                          Rechercher
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ex: ALH, EET, QUE..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Type de météorite</Form.Label>
                        <Form.Select
                          value={meteoriteType}
                          onChange={(e) => setMeteoriteType(e.target.value)}
                        >
                          <option value="">Tous les types</option>
                          <option value="H">H Chondrite</option>
                          <option value="L">L Chondrite</option>
                          <option value="LL">LL Chondrite</option>
                          <option value="C">Carbonaceous Chondrite</option>
                          <option value="E">Enstatite Chondrite</option>
                          <option value="R">Rumuruti Chondrite</option>
                          <option value="Iron">Iron Meteorite</option>
                          <option value="Stony-iron">Stony-Iron Meteorite</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Année de découverte</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Ex: 1984"
                          value={yearFound}
                          onChange={(e) => setYearFound(e.target.value)}
                          min="1976"
                          max="2024"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2} className="d-flex align-items-end">
                      <Button
                        type="submit"
                        variant="primary"
                        className="w-100"
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
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Statistiques */}
        {meteoritesData && (
          <Row className="mb-4">
            <Col>
              <Card className="bg-light">
                <Card.Body>
                  <Row className="text-center">
                    <Col md={3}>
                      <h4 className="text-primary">{meteoritesData.total || 0}</h4>
                      <small className="text-muted">Total météorites</small>
                    </Col>
                    <Col md={3}>
                      <h4 className="text-success">{meteoritesData.types?.length || 0}</h4>
                      <small className="text-muted">Types différents</small>
                    </Col>
                    <Col md={3}>
                      <h4 className="text-warning">{meteoritesData.years?.length || 0}</h4>
                      <small className="text-muted">Années de découverte</small>
                    </Col>
                    <Col md={3}>
                      <h4 className="text-info">{meteoritesData.mass_total || 'N/A'}</h4>
                      <small className="text-muted">Masse totale (kg)</small>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Résultats */}
        {meteoritesData && meteoritesData.meteorites && (
          <Row>
            <Col>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>
                  Météorites ({meteoritesData.meteorites.length} affichées)
                </h3>
                <Badge bg="info" className="me-2">
                  Page {page}
                </Badge>
              </div>

              <Row>
                {meteoritesData.meteorites.map((meteorite, index) => (
                  <Col key={meteorite.id} lg={6} className="mb-4">
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
                                {meteorite.name || 'Nom inconnu'}
                              </Card.Title>
                              <Card.Subtitle className="text-muted">
                                {meteorite.classification || 'Classification inconnue'}
                              </Card.Subtitle>
                            </div>
                            <div className="text-end">
                              {meteorite.meteorite_type && (
                                <Badge bg={getMeteoriteTypeColor(meteorite.meteorite_type)} className="mb-1">
                                  {meteorite.meteorite_type}
                                </Badge>
                              )}
                              {meteorite.year_found && (
                                <Badge bg={getYearColor(meteorite.year_found)}>
                                  {meteorite.year_found}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <Row className="mb-3">
                            <Col md={6}>
                              <small className="text-muted d-block">
                                <Calendar className="me-1" />
                                Découverte: {formatDate(meteorite.date_found)}
                              </small>
                                                             <small className="text-muted d-block">
                                 <GeoAlt className="me-1" />
                                 Site: {meteorite.find_location || 'Inconnu'}
                               </small>
                            </Col>
                            <Col md={6}>
                              <small className="text-muted d-block">
                                <InfoCircle className="me-1" />
                                Masse: {meteorite.mass || 'N/A'} g
                              </small>
                              <small className="text-muted d-block">
                                <Globe className="me-1" />
                                Région: {meteorite.region || 'Inconnue'}
                              </small>
                            </Col>
                          </Row>

                          {meteorite.description && (
                            <Card.Text className="small text-muted">
                              {meteorite.description.length > 150 
                                ? meteorite.description.substring(0, 150) + '...'
                                : meteorite.description
                              }
                            </Card.Text>
                          )}

                          {meteorite.composition && (
                            <div className="mt-2">
                              <small className="text-muted">Composition:</small>
                              <div className="mt-1">
                                {meteorite.composition.split(',').slice(0, 3).map((comp, idx) => (
                                  <Badge key={idx} bg="light" text="dark" className="me-1 small">
                                    {comp.trim()}
                                  </Badge>
                                ))}
                                {meteorite.composition.split(',').length > 3 && (
                                  <Badge bg="light" text="dark" className="small">
                                    +{meteorite.composition.split(',').length - 3} autres
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {meteorite.notes && (
                            <div className="mt-2">
                              <small className="text-muted">Notes:</small>
                              <p className="small text-muted mt-1">
                                {meteorite.notes.length > 100 
                                  ? meteorite.notes.substring(0, 100) + '...'
                                  : meteorite.notes
                                }
                              </p>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>

              {/* Bouton "Charger plus" */}
              {meteoritesData.meteorites.length >= 20 && (
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
                        'Charger plus de météorites'
                      )}
                    </Button>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        )}

        {/* Message d'accueil si aucune donnée */}
        {!meteoritesData && !isLoading && (
          <Row>
            <Col className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Snow size={64} className="text-muted mb-3" />
                <h4>Chargement des météorites antarctiques</h4>
                <p className="text-muted">
                  Utilisez les filtres ci-dessus pour explorer la collection de météorites
                </p>
              </motion.div>
            </Col>
          </Row>
        )}
      </Container>
    </motion.div>
  );
};

export default AntarcticMeteoritesPage; 