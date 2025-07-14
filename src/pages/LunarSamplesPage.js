import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { Moon, Search, Filter, Calendar, GeoAlt, InfoCircle } from 'react-bootstrap-icons';
import { lunarSamplesService } from '../services/nasaApi';

const LunarSamplesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sampleType, setSampleType] = useState('');
  const [mission, setMission] = useState('');
  const [page, setPage] = useState(1);

  const {
    data: samplesData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['lunarSamples', searchQuery, sampleType, mission, page],
    queryFn: () => lunarSamplesService.getSamples({
      search: searchQuery,
      sample_type: sampleType,
      mission: mission,
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

  const getSampleTypeColor = (type) => {
    const colors = {
      'Rock': 'primary',
      'Soil': 'success',
      'Core': 'warning',
      'Breccia': 'info',
      'Regolith': 'secondary',
      'Dust': 'dark'
    };
    return colors[type] || 'light';
  };

  const getMissionColor = (mission) => {
    const colors = {
      'Apollo 11': 'danger',
      'Apollo 12': 'warning',
      'Apollo 14': 'info',
      'Apollo 15': 'success',
      'Apollo 16': 'primary',
      'Apollo 17': 'secondary'
    };
    return colors[mission] || 'light';
  };

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Erreur lors du chargement</Alert.Heading>
          <p>{error.message || 'Une erreur s\'est produite lors de la récupération des échantillons lunaires.'}</p>
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
                <Moon className="me-3" />
                Échantillons Lunaires
              </h1>
              <p className="lead text-center text-muted">
                Explorez la collection d'échantillons lunaires ramenés par les missions Apollo
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
                          placeholder="Ex: 10084, basalt, anorthosite..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Type d'échantillon</Form.Label>
                        <Form.Select
                          value={sampleType}
                          onChange={(e) => setSampleType(e.target.value)}
                        >
                          <option value="">Tous les types</option>
                          <option value="Rock">Roche</option>
                          <option value="Soil">Sol</option>
                          <option value="Core">Carotte</option>
                          <option value="Breccia">Brèche</option>
                          <option value="Regolith">Régolithe</option>
                          <option value="Dust">Poussière</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Mission</Form.Label>
                        <Form.Select
                          value={mission}
                          onChange={(e) => setMission(e.target.value)}
                        >
                          <option value="">Toutes les missions</option>
                          <option value="Apollo 11">Apollo 11</option>
                          <option value="Apollo 12">Apollo 12</option>
                          <option value="Apollo 14">Apollo 14</option>
                          <option value="Apollo 15">Apollo 15</option>
                          <option value="Apollo 16">Apollo 16</option>
                          <option value="Apollo 17">Apollo 17</option>
                        </Form.Select>
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
        {samplesData && (
          <Row className="mb-4">
            <Col>
              <Card className="bg-light">
                <Card.Body>
                  <Row className="text-center">
                    <Col md={3}>
                      <h4 className="text-primary">{samplesData.total || 0}</h4>
                      <small className="text-muted">Total échantillons</small>
                    </Col>
                    <Col md={3}>
                      <h4 className="text-success">{samplesData.missions?.length || 0}</h4>
                      <small className="text-muted">Missions</small>
                    </Col>
                    <Col md={3}>
                      <h4 className="text-warning">{samplesData.sample_types?.length || 0}</h4>
                      <small className="text-muted">Types d'échantillons</small>
                    </Col>
                    <Col md={3}>
                      <h4 className="text-info">{samplesData.mass_total || 'N/A'}</h4>
                      <small className="text-muted">Masse totale (kg)</small>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Résultats */}
        {samplesData && samplesData.samples && (
          <Row>
            <Col>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>
                  Échantillons ({samplesData.samples.length} affichés)
                </h3>
                <Badge bg="info" className="me-2">
                  Page {page}
                </Badge>
              </div>

              <Row>
                {samplesData.samples.map((sample, index) => (
                  <Col key={sample.id} lg={6} className="mb-4">
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
                                {sample.sample_id || 'ID inconnu'}
                              </Card.Title>
                              <Card.Subtitle className="text-muted">
                                {sample.name || 'Nom inconnu'}
                              </Card.Subtitle>
                            </div>
                            <div className="text-end">
                              {sample.sample_type && (
                                <Badge bg={getSampleTypeColor(sample.sample_type)} className="mb-1">
                                  {sample.sample_type}
                                </Badge>
                              )}
                              {sample.mission && (
                                <Badge bg={getMissionColor(sample.mission)}>
                                  {sample.mission}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <Row className="mb-3">
                            <Col md={6}>
                              <small className="text-muted d-block">
                                <Calendar className="me-1" />
                                Collecté: {formatDate(sample.collection_date)}
                              </small>
                                                             <small className="text-muted d-block">
                                 <GeoAlt className="me-1" />
                                 Site: {sample.collection_site || 'Inconnu'}
                               </small>
                            </Col>
                            <Col md={6}>
                              <small className="text-muted d-block">
                                <InfoCircle className="me-1" />
                                Masse: {sample.mass || 'N/A'} g
                              </small>
                              <small className="text-muted d-block">
                                <Filter className="me-1" />
                                Taille: {sample.size || 'N/A'}
                              </small>
                            </Col>
                          </Row>

                          {sample.description && (
                            <Card.Text className="small text-muted">
                              {sample.description.length > 150 
                                ? sample.description.substring(0, 150) + '...'
                                : sample.description
                              }
                            </Card.Text>
                          )}

                          {sample.composition && (
                            <div className="mt-2">
                              <small className="text-muted">Composition:</small>
                              <div className="mt-1">
                                {sample.composition.split(',').slice(0, 3).map((comp, idx) => (
                                  <Badge key={idx} bg="light" text="dark" className="me-1 small">
                                    {comp.trim()}
                                  </Badge>
                                ))}
                                {sample.composition.split(',').length > 3 && (
                                  <Badge bg="light" text="dark" className="small">
                                    +{sample.composition.split(',').length - 3} autres
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>

              {/* Bouton "Charger plus" */}
              {samplesData.samples.length >= 20 && (
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
                        'Charger plus d\'échantillons'
                      )}
                    </Button>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        )}

        {/* Message d'accueil si aucune donnée */}
        {!samplesData && !isLoading && (
          <Row>
            <Col className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Moon size={64} className="text-muted mb-3" />
                <h4>Chargement des échantillons lunaires</h4>
                <p className="text-muted">
                  Utilisez les filtres ci-dessus pour explorer la collection d'échantillons
                </p>
              </motion.div>
            </Col>
          </Row>
        )}
      </Container>
    </motion.div>
  );
};

export default LunarSamplesPage; 