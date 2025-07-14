import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { Search, Image, Calendar, Eye } from 'react-bootstrap-icons';
import { nasaImagesService } from '../services/nasaApi';

const NasaImagesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [yearStart, setYearStart] = useState('');
  const [yearEnd, setYearEnd] = useState('');
  const [page, setPage] = useState(1);

  const {
    data: imagesData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['nasaImages', searchQuery, mediaType, yearStart, yearEnd, page],
    queryFn: () => nasaImagesService.search(searchQuery || 'space', {
      media_type: mediaType,
      year_start: yearStart,
      year_end: yearEnd,
      page
    }),
    enabled: !!searchQuery || page > 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
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

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Erreur lors du chargement</Alert.Heading>
          <p>{error.message || 'Une erreur s\'est produite lors de la récupération des images NASA.'}</p>
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
                <Image className="me-3" />
                NASA Images & Video Library
              </h1>
              <p className="lead text-center text-muted">
                Explorez la vaste collection d'images et de vidéos de la NASA
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
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <Search className="me-2" />
                          Rechercher
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ex: Mars, Apollo, Hubble..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Type de média</Form.Label>
                        <Form.Select
                          value={mediaType}
                          onChange={(e) => setMediaType(e.target.value)}
                        >
                          <option value="image">Images</option>
                          <option value="video">Vidéos</option>
                          <option value="audio">Audio</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Année début</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="1958"
                          value={yearStart}
                          onChange={(e) => setYearStart(e.target.value)}
                          min="1958"
                          max="2024"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Année fin</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="2024"
                          value={yearEnd}
                          onChange={(e) => setYearEnd(e.target.value)}
                          min="1958"
                          max="2024"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={9} className="d-flex align-items-end">
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

        {/* Résultats */}
        {imagesData && (
          <Row>
            <Col>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>
                  Résultats ({imagesData.collection?.metadata?.total_hits || 0} trouvés)
                </h3>
                {imagesData.collection?.links && (
                  <div>
                    <Badge bg="info" className="me-2">
                      Page {page}
                    </Badge>
                  </div>
                )}
              </div>

              <Row>
                {imagesData.collection?.items?.map((item, index) => (
                  <Col key={item.href} lg={4} md={6} className="mb-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-100 shadow-sm hover-lift">
                        <div className="position-relative">
                          {item.links?.[0]?.href && (
                            <Card.Img
                              variant="top"
                              src={item.links[0].href}
                              alt={item.data?.[0]?.title || 'Image NASA'}
                              style={{ height: '200px', objectFit: 'cover' }}
                            />
                          )}
                          <div className="position-absolute top-0 end-0 m-2">
                            <Badge bg="primary">
                              {item.data?.[0]?.media_type || 'image'}
                            </Badge>
                          </div>
                        </div>
                        <Card.Body className="d-flex flex-column">
                          <Card.Title className="h6">
                            {truncateText(item.data?.[0]?.title || 'Sans titre', 60)}
                          </Card.Title>
                          <Card.Text className="text-muted small flex-grow-1">
                            {truncateText(item.data?.[0]?.description || 'Aucune description disponible')}
                          </Card.Text>
                          <div className="mt-auto">
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">
                                <Calendar className="me-1" />
                                {formatDate(item.data?.[0]?.date_created)}
                              </small>
                              <div>
                                {item.links?.[0]?.href && (
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    href={item.links[0].href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Eye className="me-1" />
                                    Voir
                                  </Button>
                                )}
                              </div>
                            </div>
                            {item.data?.[0]?.keywords && item.data[0].keywords.length > 0 && (
                              <div className="mt-2">
                                {item.data[0].keywords.slice(0, 3).map((keyword, idx) => (
                                  <Badge key={idx} bg="secondary" className="me-1 small">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>

              {/* Bouton "Charger plus" */}
              {imagesData.collection?.links?.find(link => link.rel === 'next') && (
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
                        'Charger plus d\'images'
                      )}
                    </Button>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        )}

        {/* Message d'accueil si aucune recherche */}
        {!searchQuery && !imagesData && (
          <Row>
            <Col className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Image size={64} className="text-muted mb-3" />
                <h4>Commencez votre exploration</h4>
                <p className="text-muted">
                  Utilisez le formulaire de recherche ci-dessus pour découvrir des milliers d'images et vidéos de la NASA
                </p>
              </motion.div>
            </Col>
          </Row>
        )}
      </Container>
    </motion.div>
  );
};

export default NasaImagesPage; 