import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Sun, Search, GeoAlt, Calendar, Thermometer, Droplet, Wind } from 'react-bootstrap-icons';
import { nasaPowerService } from '../services/nasaApi';

const NasaPowerPage = () => {
  const [latitude, setLatitude] = useState('48.8566');
  const [longitude, setLongitude] = useState('2.3522');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [parameter, setParameter] = useState('T2M');
  const [community, setCommunity] = useState('RE');

  const {
    data: powerData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['nasaPower', latitude, longitude, startDate, endDate, parameter, community],
    queryFn: () => nasaPowerService.getData({
      parameters: parameter,
      longitude: longitude,
      latitude: latitude,
      start: startDate,
      end: endDate,
      community: community,
      format: 'JSON'
    }),
    enabled: !!latitude && !!longitude && !!startDate && !!endDate,
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getParameterInfo = (param) => {
    const params = {
      'T2M': { name: 'Température à 2m', unit: '°C', icon: Thermometer, color: 'danger' },
      'T2M_MAX': { name: 'Température max à 2m', unit: '°C', icon: Thermometer, color: 'danger' },
      'T2M_MIN': { name: 'Température min à 2m', unit: '°C', icon: Thermometer, color: 'info' },
      'PRECTOT': { name: 'Précipitations', unit: 'mm/jour', icon: Droplet, color: 'primary' },
      'WS2M': { name: 'Vitesse du vent à 2m', unit: 'm/s', icon: Wind, color: 'warning' },
      'RH2M': { name: 'Humidité relative à 2m', unit: '%', icon: Droplet, color: 'info' },
      'PS': { name: 'Pression de surface', unit: 'hPa', icon: Wind, color: 'secondary' },
      'ALLSKY_SFC_SW_DWN': { name: 'Rayonnement solaire', unit: 'kWh/m²/jour', icon: Sun, color: 'warning' }
    };
    return params[param] || { name: param, unit: '', icon: Sun, color: 'light' };
  };

  const getCommunityInfo = (comm) => {
    const communities = {
      'RE': 'Renewable Energy',
      'AG': 'Agriculture',
      'SB': 'Sustainable Buildings',
      'SS': 'Solar System',
      'CL': 'Climate'
    };
    return communities[comm] || comm;
  };

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Erreur lors du chargement</Alert.Heading>
          <p>{error.message || 'Une erreur s\'est produite lors de la récupération des données POWER.'}</p>
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
                <Sun className="me-3" />
                NASA POWER
              </h1>
              <p className="lead text-center text-muted">
                Prediction Of Worldwide Energy Resources - Données climatiques et énergétiques
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
                    <Col md={6} className="d-flex align-items-end">
                      <Button
                        variant="outline-secondary"
                        onClick={handleCurrentLocation}
                        className="w-100"
                      >
                        <GeoAlt className="me-2" />
                        Ma position
                      </Button>
                    </Col>
                  </Row>
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
                        <Form.Label>Paramètre</Form.Label>
                        <Form.Select
                          value={parameter}
                          onChange={(e) => setParameter(e.target.value)}
                        >
                          <option value="T2M">Température à 2m</option>
                          <option value="T2M_MAX">Température max</option>
                          <option value="T2M_MIN">Température min</option>
                          <option value="PRECTOT">Précipitations</option>
                          <option value="WS2M">Vitesse du vent</option>
                          <option value="RH2M">Humidité relative</option>
                          <option value="PS">Pression de surface</option>
                          <option value="ALLSKY_SFC_SW_DWN">Rayonnement solaire</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Communauté</Form.Label>
                        <Form.Select
                          value={community}
                          onChange={(e) => setCommunity(e.target.value)}
                        >
                          <option value="RE">Renewable Energy</option>
                          <option value="AG">Agriculture</option>
                          <option value="SB">Sustainable Buildings</option>
                          <option value="SS">Solar System</option>
                          <option value="CL">Climate</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="text-center">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Récupération des données...
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

        {/* Résultats */}
        {powerData && (
          <Row>
            <Col>
              {/* Informations générales */}
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
                            {formatDate(startDate)} - {formatDate(endDate)}
                          </h5>
                          <small className="text-muted">Période</small>
                        </Col>
                        <Col md={3}>
                          <h5 className="text-warning">
                            {getParameterInfo(parameter).name}
                          </h5>
                          <small className="text-muted">Paramètre</small>
                        </Col>
                        <Col md={3}>
                          <h5 className="text-info">
                            {getCommunityInfo(community)}
                          </h5>
                          <small className="text-muted">Communauté</small>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Données */}
              {powerData.parameters && (
                <Row>
                  <Col>
                    <Card>
                      <Card.Header>
                                                <h4>
                          {(() => {
                            const IconComponent = getParameterInfo(parameter).icon;
                            return IconComponent ? <IconComponent className="me-2" /> : null;
                          })()}
                          Données {getParameterInfo(parameter).name}
                        </h4>
                      </Card.Header>
                      <Card.Body>
                        {powerData.parameters[parameter] && (
                          <div>
                            <Row className="mb-3">
                              <Col md={6}>
                                <strong>Unité:</strong> {getParameterInfo(parameter).unit}
                              </Col>
                              <Col md={6}>
                                <strong>Nombre de valeurs:</strong> {powerData.parameters[parameter].length || 0}
                              </Col>
                            </Row>
                            
                            {/* Statistiques */}
                            {powerData.parameters[parameter].length > 0 && (
                              <Row className="mb-4">
                                <Col>
                                  <h5>Statistiques</h5>
                                  <Row className="text-center">
                                    <Col md={3}>
                                      <Card className="bg-primary text-white">
                                        <Card.Body>
                                          <h6>Moyenne</h6>
                                          <h4>
                                            {powerData.parameters[parameter].reduce((a, b) => a + b, 0) / powerData.parameters[parameter].length}
                                          </h4>
                                        </Card.Body>
                                      </Card>
                                    </Col>
                                    <Col md={3}>
                                      <Card className="bg-success text-white">
                                        <Card.Body>
                                          <h6>Maximum</h6>
                                          <h4>{Math.max(...powerData.parameters[parameter])}</h4>
                                        </Card.Body>
                                      </Card>
                                    </Col>
                                    <Col md={3}>
                                      <Card className="bg-warning text-white">
                                        <Card.Body>
                                          <h6>Minimum</h6>
                                          <h4>{Math.min(...powerData.parameters[parameter])}</h4>
                                        </Card.Body>
                                      </Card>
                                    </Col>
                                    <Col md={3}>
                                      <Card className="bg-info text-white">
                                        <Card.Body>
                                          <h6>Écart-type</h6>
                                          <h4>
                                            {Math.sqrt(
                                              powerData.parameters[parameter].reduce((sq, n) => sq + Math.pow(n - (powerData.parameters[parameter].reduce((a, b) => a + b, 0) / powerData.parameters[parameter].length), 2), 0) / powerData.parameters[parameter].length
                                            ).toFixed(2)}
                                          </h4>
                                        </Card.Body>
                                      </Card>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            )}

                            {/* Graphique simple */}
                            {powerData.parameters[parameter].length > 0 && (
                              <div className="mt-4">
                                <h5>Évolution temporelle</h5>
                                <div className="bg-light p-3 rounded">
                                  <div className="d-flex align-items-end" style={{ height: '200px' }}>
                                    {powerData.parameters[parameter].slice(0, 30).map((value, index) => {
                                      const max = Math.max(...powerData.parameters[parameter]);
                                      const min = Math.min(...powerData.parameters[parameter]);
                                      const height = ((value - min) / (max - min)) * 100;
                                      return (
                                        <div
                                          key={index}
                                          className="bg-primary mx-1"
                                          style={{
                                            width: '10px',
                                            height: `${height}%`,
                                            minHeight: '2px'
                                          }}
                                          title={`Jour ${index + 1}: ${value} ${getParameterInfo(parameter).unit}`}
                                        />
                                      );
                                    })}
                                  </div>
                                  <div className="text-center mt-2">
                                    <small className="text-muted">
                                      Premiers 30 jours de données
                                    </small>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}

              {/* Métadonnées */}
              {powerData.header && (
                <Row className="mt-4">
                  <Col>
                    <Card>
                      <Card.Header>
                        <h5>Métadonnées</h5>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col md={6}>
                            <p><strong>Source:</strong> {powerData.header.title || 'NASA POWER'}</p>
                            <p><strong>Résolution:</strong> {powerData.header.resolution || 'N/A'}</p>
                            <p><strong>Format:</strong> {powerData.header.format || 'JSON'}</p>
                          </Col>
                          <Col md={6}>
                            <p><strong>Date de génération:</strong> {formatDate(powerData.header.generated || new Date())}</p>
                            <p><strong>Message:</strong> {powerData.header.message || 'Données récupérées avec succès'}</p>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        )}

        {/* Message d'accueil si aucune donnée */}
        {!powerData && !isLoading && (
          <Row>
            <Col className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Sun size={64} className="text-muted mb-3" />
                <h4>Récupérez des données climatiques</h4>
                <p className="text-muted">
                  Entrez des coordonnées géographiques et une période pour obtenir des données climatiques détaillées
                </p>
              </motion.div>
            </Col>
          </Row>
        )}
      </Container>
    </motion.div>
  );
};

export default NasaPowerPage; 