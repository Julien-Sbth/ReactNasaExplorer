import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { Globe, Search, GeoAlt, Calendar, Image, Eye, Download } from 'react-bootstrap-icons';
import { earthService } from '../services/nasaApi';

const EarthPage = () => {
  const [latitude, setLatitude] = useState('48.8566');
  const [longitude, setLongitude] = useState('2.3522');
  const [date, setDate] = useState('');
  const [dim, setDim] = useState('0.15');
  const [dataType, setDataType] = useState('assets');

  const {
    data: earthData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['earth', latitude, longitude, date, dim, dataType],
    queryFn: () => {
      if (dataType === 'assets') {
        return earthService.getAssets(latitude, longitude, date);
      } else {
        return earthService.getImagery(latitude, longitude, date, dim);
      }
    },
    enabled: !!latitude && !!longitude && !!date,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(4));
          setLongitude(position.coords.longitude.toFixed(4));
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
        }
      );
    }
  };

  const handleToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getDataTypeInfo = (type) => {
    const types = {
      'assets': { name: 'Assets disponibles', icon: Image, color: 'primary' },
      'imagery': { name: 'Imagerie satellite', icon: Eye, color: 'success' }
    };
    return types[type] || { name: type, icon: Image, color: 'light' };
  };



  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Erreur lors du chargement</Alert.Heading>
          <p>{error.message || 'Une erreur s\'est produite lors de la récupération des données Earth.'}</p>
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
                <Globe className="me-3" />
                NASA Earth
              </h1>
              <p className="lead text-center text-muted">
                Explorez la Terre depuis l'espace avec les données satellites de la NASA
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
                          <GeoAlt className="me-2" />
                          Latitude
                        </Form.Label>
                        <Form.Control
                          type="number"
                          step="0.0001"
                          placeholder="48.8566"
                          value={latitude}
                          onChange={(e) => setLatitude(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <GeoAlt className="me-2" />
                          Longitude
                        </Form.Label>
                        <Form.Control
                          type="number"
                          step="0.0001"
                          placeholder="2.3522"
                          value={longitude}
                          onChange={(e) => setLongitude(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <Calendar className="me-2" />
                          Date
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3} className="d-flex align-items-end">
                      <div className="d-flex gap-2 w-100">
                        <Button
                          variant="outline-secondary"
                          onClick={handleCurrentLocation}
                          className="flex-fill"
                        >
                          <GeoAlt className="me-1" />
                          Ma position
                        </Button>
                        <Button
                          variant="outline-info"
                          onClick={handleToday}
                          className="flex-fill"
                        >
                          <Calendar className="me-1" />
                          Aujourd'hui
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Type de données</Form.Label>
                        <Form.Select
                          value={dataType}
                          onChange={(e) => setDataType(e.target.value)}
                        >
                          <option value="assets">Assets disponibles</option>
                          <option value="imagery">Imagerie satellite</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Dimension (degrés)</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.01"
                          placeholder="0.15"
                          value={dim}
                          onChange={(e) => setDim(e.target.value)}
                          min="0.01"
                          max="1.0"
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
                            Obtenir les données
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

        {/* Informations de localisation */}
        <Row className="mb-4">
          <Col>
            <Card className="bg-light">
              <Card.Body>
                <Row className="text-center">
                  <Col md={3}>
                    <h5 className="text-primary">
                      {latitude}°, {longitude}°
                    </h5>
                    <small className="text-muted">Coordonnées</small>
                  </Col>
                  <Col md={3}>
                    <h5 className="text-success">
                      {date ? formatDate(date) : 'Date non spécifiée'}
                    </h5>
                    <small className="text-muted">Date de capture</small>
                  </Col>
                  <Col md={3}>
                    <h5 className="text-warning">
                      {dim}° × {dim}°
                    </h5>
                    <small className="text-muted">Zone de couverture</small>
                  </Col>
                  <Col md={3}>
                    <h5 className="text-info">
                      {getDataTypeInfo(dataType).name}
                    </h5>
                    <small className="text-muted">Type de données</small>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Résultats */}
        {earthData && (
          <Row>
            <Col>
              {dataType === 'assets' && earthData.results && (
                <div>
                  <h3 className="mb-4">
                    Assets disponibles ({earthData.results.length})
                  </h3>
                  <Row>
                    {earthData.results.map((asset, index) => (
                      <Col key={asset.date} lg={4} md={6} className="mb-4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="h-100 shadow-sm hover-lift">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                  <Card.Title className="h6">
                                    {asset.date ? formatDate(asset.date) : 'Date inconnue'}
                                  </Card.Title>
                                  <Card.Subtitle className="text-muted">
                                    {asset.resource?.dataset || 'Dataset inconnu'}
                                  </Card.Subtitle>
                                </div>
                                <Badge bg="primary">
                                  {asset.resource?.planet || 'Earth'}
                                </Badge>
                              </div>

                              <div className="mb-3">
                                <small className="text-muted d-block">
                                  <Image className="me-1" />
                                  Service: {asset.resource?.service_version || 'N/A'}
                                </small>
                                <small className="text-muted d-block">
                                  <Eye className="me-1" />
                                  URL: {asset.url ? 'Disponible' : 'Non disponible'}
                                </small>
                              </div>

                              {asset.url && (
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  href={asset.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-100"
                                >
                                  <Download className="me-1" />
                                  Voir l'asset
                                </Button>
                              )}
                            </Card.Body>
                          </Card>
                        </motion.div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              {dataType === 'imagery' && earthData.url && (
                <div>
                  <h3 className="mb-4">Imagerie satellite</h3>
                  <Row>
                    <Col>
                      <Card>
                        <Card.Header>
                          <h5>
                            <Image className="me-2" />
                            Image satellite du {formatDate(date)}
                          </h5>
                        </Card.Header>
                        <Card.Body>
                          <div className="text-center">
                            <img
                              src={earthData.url}
                              alt={`Satellite view ${latitude}, ${longitude}`}
                              className="img-fluid rounded shadow"
                              style={{ maxHeight: '500px' }}
                            />
                          </div>
                          
                          <Row className="mt-4">
                            <Col md={6}>
                              <h6>Informations techniques</h6>
                              <ul className="list-unstyled">
                                <li><strong>Résolution:</strong> {dim}° × {dim}°</li>
                                <li><strong>Format:</strong> {earthData.format || 'JPEG'}</li>
                                <li><strong>Service:</strong> {earthData.service_version || 'N/A'}</li>
                              </ul>
                            </Col>
                            <Col md={6}>
                              <h6>Métadonnées</h6>
                              <ul className="list-unstyled">
                                <li><strong>Planète:</strong> {earthData.planet || 'Earth'}</li>
                                <li><strong>Date:</strong> {formatDate(date)}</li>
                                <li><strong>Coordonnées:</strong> {latitude}°, {longitude}°</li>
                              </ul>
                            </Col>
                          </Row>

                          <div className="text-center mt-3">
                            <Button
                              variant="primary"
                              href={earthData.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="me-2"
                            >
                              <Download className="me-2" />
                              Télécharger l'image
                            </Button>
                            <Button
                              variant="outline-secondary"
                              onClick={() => window.open(earthData.url, '_blank')}
                            >
                              <Eye className="me-2" />
                              Voir en plein écran
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>
              )}
            </Col>
          </Row>
        )}

        {/* Message d'accueil si aucune donnée */}
        {!earthData && !isLoading && (
          <Row>
            <Col className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Globe size={64} className="text-muted mb-3" />
                <h4>Explorez la Terre depuis l'espace</h4>
                <p className="text-muted">
                  Entrez des coordonnées géographiques et une date pour obtenir des images satellites
                </p>
              </motion.div>
            </Col>
          </Row>
        )}
      </Container>
    </motion.div>
  );
};

export default EarthPage; 