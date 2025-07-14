import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, Badge, Tabs, Tab } from 'react-bootstrap';
import { Mortarboard, Search, Calendar, People, Book, Award, Briefcase } from 'react-bootstrap-icons';
import { stemService } from '../services/nasaApi';

const StemPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('activities');
  const [page, setPage] = useState(1);

  const {
    data: stemData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['stem', category, searchQuery, page],
    queryFn: () => {
      switch (category) {
        case 'activities':
          return stemService.getActivities({ search: searchQuery, page });
        case 'events':
          return stemService.getEvents({ search: searchQuery, page });
        case 'challenges':
          return stemService.getChallenges({ search: searchQuery, page });
        case 'internships':
          return stemService.getInternships({ search: searchQuery, page });
        case 'scholarships':
          return stemService.getScholarships({ search: searchQuery, page });
        case 'resources':
          return stemService.getResources({ search: searchQuery, page });
        default:
          return stemService.getActivities({ search: searchQuery, page });
      }
    },
    enabled: true,
    staleTime: 15 * 60 * 1000, // 15 minutes
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

  const getCategoryInfo = (cat) => {
    const categories = {
      'activities': { name: 'Activités', icon: Book, color: 'primary' },
      'events': { name: 'Événements', icon: Calendar, color: 'success' },
      'challenges': { name: 'Défis', icon: Award, color: 'warning' },
      'internships': { name: 'Stages', icon: Briefcase, color: 'info' },
      'scholarships': { name: 'Bourses', icon: Award, color: 'danger' },
      'resources': { name: 'Ressources', icon: Book, color: 'secondary' }
    };
    return categories[cat] || { name: cat, icon: Book, color: 'light' };
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Erreur lors du chargement</Alert.Heading>
          <p>{error.message || 'Une erreur s\'est produite lors de la récupération des données STEM.'}</p>
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
                <Mortarboard className="me-3" />
                NASA STEM
              </h1>
              <p className="lead text-center text-muted">
                Science, Technology, Engineering & Mathematics - Ressources éducatives de la NASA
              </p>
            </motion.div>
          </Col>
        </Row>

        {/* Formulaire de recherche */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto">
            <Card className="shadow-sm">
              <Card.Body>
                <Form onSubmit={handleSearch}>
                  <Row>
                    <Col md={8}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <Search className="me-2" />
                          Rechercher
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ex: Mars, robotique, astronomie..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4} className="d-flex align-items-end">
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

        {/* Onglets de catégories */}
        <Row className="mb-4">
          <Col>
            <Tabs
              activeKey={category}
              onSelect={(k) => {
                setCategory(k);
                setPage(1);
              }}
              className="justify-content-center"
            >
              <Tab eventKey="activities" title={
                <span>
                  <Book className="me-2" />
                  Activités
                </span>
              } />
              <Tab eventKey="events" title={
                <span>
                  <Calendar className="me-2" />
                  Événements
                </span>
              } />
              <Tab eventKey="challenges" title={
                <span>
                  <Award className="me-2" />
                  Défis
                </span>
              } />
              <Tab eventKey="internships" title={
                <span>
                  <Briefcase className="me-2" />
                  Stages
                </span>
              } />
              <Tab eventKey="scholarships" title={
                <span>
                  <Award className="me-2" />
                  Bourses
                </span>
              } />
              <Tab eventKey="resources" title={
                <span>
                  <Book className="me-2" />
                  Ressources
                </span>
              } />
            </Tabs>
          </Col>
        </Row>

        {/* Statistiques */}
        {stemData && (
          <Row className="mb-4">
            <Col>
              <Card className="bg-light">
                <Card.Body>
                  <Row className="text-center">
                    <Col md={3}>
                      <h4 className="text-primary">{stemData.total || 0}</h4>
                      <small className="text-muted">Total {getCategoryInfo(category).name}</small>
                    </Col>
                    <Col md={3}>
                      <h4 className="text-success">{stemData.categories?.length || 0}</h4>
                      <small className="text-muted">Catégories</small>
                    </Col>
                    <Col md={3}>
                      <h4 className="text-warning">{stemData.grade_levels?.length || 0}</h4>
                      <small className="text-muted">Niveaux scolaires</small>
                    </Col>
                    <Col md={3}>
                      <h4 className="text-info">{stemData.subjects?.length || 0}</h4>
                      <small className="text-muted">Sujets</small>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Résultats */}
        {stemData && stemData.items && (
          <Row>
            <Col>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>
                  {getCategoryInfo(category).name} ({stemData.items.length} affichés)
                </h3>
                <Badge bg="info" className="me-2">
                  Page {page}
                </Badge>
              </div>

              <Row>
                {stemData.items.map((item, index) => (
                  <Col key={item.id} lg={6} className="mb-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-100 shadow-sm hover-lift">
                        {item.image_url && (
                          <Card.Img
                            variant="top"
                            src={item.image_url}
                            alt={item.title || 'Image STEM'}
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                        )}
                        <Card.Body className="d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <Card.Title className="h5 mb-1">
                              {item.title || 'Sans titre'}
                            </Card.Title>
                            <Badge bg={getCategoryInfo(category).color}>
                              {getCategoryInfo(category).name}
                            </Badge>
                          </div>

                          <Card.Text className="text-muted small flex-grow-1">
                            {truncateText(item.description || 'Aucune description disponible')}
                          </Card.Text>

                          <div className="mt-auto">
                            <Row className="mb-2">
                              <Col md={6}>
                                <small className="text-muted d-block">
                                  <Calendar className="me-1" />
                                  {item.date ? formatDate(item.date) : 'Date non spécifiée'}
                                </small>
                              </Col>
                              <Col md={6}>
                                <small className="text-muted d-block">
                                  <People className="me-1" />
                                  {item.grade_level || 'Tous niveaux'}
                                </small>
                              </Col>
                            </Row>

                            {item.subjects && item.subjects.length > 0 && (
                              <div className="mb-2">
                                {item.subjects.slice(0, 3).map((subject, idx) => (
                                  <Badge key={idx} bg="light" text="dark" className="me-1 small">
                                    {subject}
                                  </Badge>
                                ))}
                                {item.subjects.length > 3 && (
                                  <Badge bg="light" text="dark" className="small">
                                    +{item.subjects.length - 3} autres
                                  </Badge>
                                )}
                              </div>
                            )}

                            {item.url && (
                              <Button
                                variant="outline-primary"
                                size="sm"
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-100"
                              >
                                En savoir plus
                              </Button>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>

              {/* Bouton "Charger plus" */}
              {stemData.items.length >= 20 && (
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
                        `Charger plus de ${getCategoryInfo(category).name.toLowerCase()}`
                      )}
                    </Button>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        )}

        {/* Message d'accueil si aucune donnée */}
        {!stemData && !isLoading && (
          <Row>
            <Col className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Mortarboard size={64} className="text-muted mb-3" />
                <h4>Explorez les ressources STEM de la NASA</h4>
                <p className="text-muted">
                  Sélectionnez une catégorie ci-dessus pour découvrir des activités, événements et ressources éducatives
                </p>
              </motion.div>
            </Col>
          </Row>
        )}
      </Container>
    </motion.div>
  );
};

export default StemPage; 