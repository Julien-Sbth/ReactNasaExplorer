import React from 'react';
import { Container, Row, Col, Card, Alert, Badge } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FaInfo, FaThermometerHalf, FaWind, FaTachometerAlt } from 'react-icons/fa';
import { insightWeatherService } from '../services/nasaApi';

const InsightPage = () => {
  // Query pour la météo InSight
  const { data: weatherData, isLoading, error } = useQuery(
    ['insight-weather'],
    () => insightWeatherService.getWeather(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchInterval: 10 * 60 * 1000, // Rafraîchir toutes les 10 minutes
    }
  );

  const formatTemperature = (temp) => {
    if (temp === null || temp === undefined) return 'N/A';
    return `${temp}°C`;
  };

  const formatPressure = (pressure) => {
    if (pressure === null || pressure === undefined) return 'N/A';
    return `${pressure} Pa`;
  };

  const formatWindSpeed = (speed) => {
    if (speed === null || speed === undefined) return 'N/A';
    return `${speed} m/s`;
  };

  const getTemperatureColor = (temp) => {
    if (temp === null || temp === undefined) return 'secondary';
    if (temp < -50) return 'primary';
    if (temp < -20) return 'info';
    if (temp < 0) return 'warning';
    return 'danger';
  };

  return (
    <Container className="page-container">
      <Helmet>
        <title>Météo InSight | NASA Data Explorer</title>
        <meta name="description" content="Consultez les données météorologiques en temps réel depuis Mars avec InSight." />
      </Helmet>

      <div className="page-header">
        <h1 className="page-title">Météo InSight</h1>
        <p className="page-description">
          Consultez les données météorologiques en temps réel depuis Mars avec l'atterrisseur InSight.
        </p>
      </div>

      {/* Informations sur InSight */}
      <Card className="nasa-card mb-4">
        <Card.Header>
          <h3>À propos d'InSight</h3>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Mission:</strong> InSight (Interior Exploration using Seismic Investigations, Geodesy and Heat Transport)</p>
              <p><strong>Lancement:</strong> 5 mai 2018</p>
              <p><strong>Atterrissage:</strong> 26 novembre 2018</p>
              <p><strong>Localisation:</strong> Elysium Planitia, Mars</p>
            </Col>
            <Col md={6}>
              <p><strong>Objectif:</strong> Étudier l'intérieur profond de Mars</p>
              <p><strong>Instruments:</strong> Sismomètre, sonde de flux thermique, station météo</p>
              <p><strong>Statut:</strong> Mission terminée (décembre 2022)</p>
              <p><strong>Données:</strong> Météo disponible jusqu'à la fin de mission</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Données météorologiques */}
      {isLoading ? (
        <div className="nasa-loader">
          <div className="spinner-border spinner-border-nasa" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="loading-text">Chargement des données météorologiques de Mars...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="error-container">
          <FaInfo className="error-icon" />
          <h4>Erreur lors du chargement</h4>
          <p className="error-message">
            {error.message || 'Impossible de récupérer les données météorologiques d\'InSight.'}
          </p>
        </Alert>
      ) : weatherData?.data ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Données actuelles */}
          <Card className="nasa-card mb-4">
            <Card.Header>
              <h3>Conditions actuelles sur Mars</h3>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="text-center mb-3">
                  <Card className="nasa-card">
                    <Card.Body>
                      <FaThermometerHalf size={32} className="text-danger mb-2" />
                      <h4>Température</h4>
                      <h2 className={`text-${getTemperatureColor(weatherData.data[0]?.AT?.av)}`}>
                        {formatTemperature(weatherData.data[0]?.AT?.av)}
                      </h2>
                      <small className="text-muted">
                        Min: {formatTemperature(weatherData.data[0]?.AT?.mn)} | 
                        Max: {formatTemperature(weatherData.data[0]?.AT?.mx)}
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={3} className="text-center mb-3">
                  <Card className="nasa-card">
                    <Card.Body>
                      <FaTachometerAlt size={32} className="text-info mb-2" />
                      <h4>Pression</h4>
                      <h2 className="text-info">
                        {formatPressure(weatherData.data[0]?.PRE?.av)}
                      </h2>
                      <small className="text-muted">
                        Min: {formatPressure(weatherData.data[0]?.PRE?.mn)} | 
                        Max: {formatPressure(weatherData.data[0]?.PRE?.mx)}
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={3} className="text-center mb-3">
                  <Card className="nasa-card">
                    <Card.Body>
                      <FaWind size={32} className="text-warning mb-2" />
                      <h4>Vent</h4>
                      <h2 className="text-warning">
                        {formatWindSpeed(weatherData.data[0]?.HWS?.av)}
                      </h2>
                      <small className="text-muted">
                        Direction: {weatherData.data[0]?.WD?.most_common?.compass_point || 'N/A'}
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={3} className="text-center mb-3">
                  <Card className="nasa-card">
                    <Card.Body>
                      <h4>Sol</h4>
                      <h2 className="text-success">
                        {weatherData.data[0]?.sol || 'N/A'}
                      </h2>
                      <small className="text-muted">
                        Jour martien depuis l'atterrissage
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Historique des 7 derniers jours */}
          <Card className="nasa-card">
            <Card.Header>
              <h3>Historique des 7 derniers jours</h3>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table nasa-table">
                  <thead>
                    <tr>
                      <th>Sol</th>
                      <th>Date</th>
                      <th>Température (°C)</th>
                      <th>Pression (Pa)</th>
                      <th>Vent (m/s)</th>
                      <th>Direction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weatherData.data.slice(0, 7).map((day, index) => (
                      <tr key={index}>
                        <td>
                          <Badge bg="secondary">{day.sol}</Badge>
                        </td>
                        <td>{new Date(day.First_UTC).toLocaleDateString('fr-FR')}</td>
                        <td>
                          <span className={`text-${getTemperatureColor(day.AT?.av)}`}>
                            {formatTemperature(day.AT?.av)}
                          </span>
                        </td>
                        <td>{formatPressure(day.PRE?.av)}</td>
                        <td>{formatWindSpeed(day.HWS?.av)}</td>
                        <td>{day.WD?.most_common?.compass_point || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      ) : (
        <Alert variant="info" className="text-center">
          <FaInfo className="me-2" />
          Aucune donnée météorologique disponible pour le moment.
        </Alert>
      )}

      {/* Informations supplémentaires */}
      <Row className="mt-4">
        <Col md={6}>
          <Card className="nasa-card">
            <Card.Header>
              <h5>Conditions sur Mars</h5>
            </Card.Header>
            <Card.Body>
              <ul>
                <li><strong>Température moyenne:</strong> -63°C</li>
                <li><strong>Pression atmosphérique:</strong> ~6 mbar (0.6% de la Terre)</li>
                <li><strong>Composition:</strong> 95% CO₂, 2.7% N₂, 1.6% Ar</li>
                <li><strong>Gravité:</strong> 38% de celle de la Terre</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="nasa-card">
            <Card.Header>
              <h5>Instruments météo</h5>
            </Card.Header>
            <Card.Body>
              <ul>
                <li><strong>Température:</strong> Capteur de température de l'air</li>
                <li><strong>Pression:</strong> Capteur de pression atmosphérique</li>
                <li><strong>Vent:</strong> Anémomètre et girouette</li>
                <li><strong>Magnétomètre:</strong> Mesure du champ magnétique</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default InsightPage; 