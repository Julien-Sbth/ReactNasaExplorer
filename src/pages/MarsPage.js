import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FaCamera, FaCalendar, FaRocket, FaInfo } from 'react-icons/fa';
import { marsPhotosService, formatDate } from '../services/nasaApi';

const MarsPage = () => {
  const [selectedRover, setSelectedRover] = useState('curiosity');
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));



  // Query pour les photos
  const { data: photosData, isLoading: photosLoading, error: photosError } = useQuery(
    ['mars-photos', selectedRover, selectedCamera, selectedDate],
    () => marsPhotosService.getPhotos(selectedRover, {
      earth_date: selectedDate,
      camera: selectedCamera,
    }),
    {
      enabled: !!selectedRover && !!selectedDate,
      staleTime: 5 * 60 * 1000,
    }
  );

  const cameras = {
    curiosity: [
      { value: 'fhaz', label: 'Front Hazard Avoidance Camera' },
      { value: 'rhaz', label: 'Rear Hazard Avoidance Camera' },
      { value: 'mast', label: 'Mast Camera' },
      { value: 'chemcam', label: 'Chemistry and Camera Complex' },
      { value: 'mahli', label: 'Mars Hand Lens Imager' },
      { value: 'mardi', label: 'Mars Descent Imager' },
      { value: 'navcam', label: 'Navigation Camera' },
    ],
    opportunity: [
      { value: 'fhaz', label: 'Front Hazard Avoidance Camera' },
      { value: 'rhaz', label: 'Rear Hazard Avoidance Camera' },
      { value: 'navcam', label: 'Navigation Camera' },
      { value: 'pancam', label: 'Panoramic Camera' },
      { value: 'minites', label: 'Miniature Thermal Emission Spectrometer' },
    ],
    spirit: [
      { value: 'fhaz', label: 'Front Hazard Avoidance Camera' },
      { value: 'rhaz', label: 'Rear Hazard Avoidance Camera' },
      { value: 'navcam', label: 'Navigation Camera' },
      { value: 'pancam', label: 'Panoramic Camera' },
      { value: 'minites', label: 'Miniature Thermal Emission Spectrometer' },
    ],
    perseverance: [
      { value: 'edl_rucam', label: 'Rover Up-Look Camera' },
      { value: 'edl_ddcam', label: 'Descent Stage Down-Look Camera' },
      { value: 'edl_pucam1', label: 'Parachute Up-Look Camera A' },
      { value: 'edl_pucam2', label: 'Parachute Up-Look Camera B' },
      { value: 'navcam_left', label: 'Navigation Camera - Left' },
      { value: 'navcam_right', label: 'Navigation Camera - Right' },
      { value: 'mcz_left', label: 'Mast Camera Zoom - Left' },
      { value: 'mcz_right', label: 'Mast Camera Zoom - Right' },
      { value: 'front_hazcam_left_a', label: 'Front Hazard Avoidance Camera - Left A' },
      { value: 'front_hazcam_right_a', label: 'Front Hazard Avoidance Camera - Right A' },
      { value: 'rear_hazcam_left', label: 'Rear Hazard Avoidance Camera - Left' },
      { value: 'rear_hazcam_right', label: 'Rear Hazard Avoidance Camera - Right' },
      { value: 'edl_rdcam', label: 'Rover Down-Look Camera' },
      { value: 'skycam', label: 'MEDA Skycam' },
      { value: 'sherloc_watson', label: 'SHERLOC WATSON Camera' },
      { value: 'supercam_rmi', label: 'SuperCam Remote Micro Imager' },
      { value: 'lcam', label: 'Lander Vision System Camera' },
    ],
  };

  const getRoverInfo = (roverName) => {
    const roverInfo = {
      curiosity: {
        name: 'Curiosity',
        launchDate: '2011-11-26',
        landingDate: '2012-08-06',
        status: 'Active',
        totalPhotos: 0,
        description: 'Rover de la mission Mars Science Laboratory',
      },
      opportunity: {
        name: 'Opportunity',
        launchDate: '2003-07-07',
        landingDate: '2004-01-25',
        status: 'Complete',
        totalPhotos: 0,
        description: 'Rover de la mission Mars Exploration Rover',
      },
      spirit: {
        name: 'Spirit',
        launchDate: '2003-06-10',
        landingDate: '2004-01-04',
        status: 'Complete',
        totalPhotos: 0,
        description: 'Rover de la mission Mars Exploration Rover',
      },
      perseverance: {
        name: 'Perseverance',
        launchDate: '2020-07-30',
        landingDate: '2021-02-18',
        status: 'Active',
        totalPhotos: 0,
        description: 'Rover de la mission Mars 2020',
      },
    };
    return roverInfo[roverName] || {};
  };

  const roverInfo = getRoverInfo(selectedRover);

  return (
    <Container className="page-container">
      <Helmet>
        <title>Photos de Mars | NASA Data Explorer</title>
        <meta name="description" content="Explorez les images capturées par les rovers Curiosity et Perseverance sur Mars." />
      </Helmet>

      <div className="page-header">
        <h1 className="page-title">Photos de Mars</h1>
        <p className="page-description">
          Explorez les images capturées par les rovers Curiosity et Perseverance sur Mars.
        </p>
      </div>

      {/* Contrôles */}
      <Card className="nasa-card mb-4">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>
                  <FaRocket className="me-2" />
                  Rover
                </Form.Label>
                <Form.Select
                  value={selectedRover}
                  onChange={(e) => setSelectedRover(e.target.value)}
                  className="nasa-form-control"
                >
                  <option value="curiosity">Curiosity</option>
                  <option value="opportunity">Opportunity</option>
                  <option value="spirit">Spirit</option>
                  <option value="perseverance">Perseverance</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>
                  <FaCamera className="me-2" />
                  Caméra
                </Form.Label>
                <Form.Select
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className="nasa-form-control"
                >
                  <option value="">Toutes les caméras</option>
                  {cameras[selectedRover]?.map((camera) => (
                    <option key={camera.value} value={camera.value}>
                      {camera.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>
                  <FaCalendar className="me-2" />
                  Date
                </Form.Label>
                <Form.Control
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="nasa-form-control"
                />
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <Button 
                onClick={() => setSelectedDate(formatDate(new Date()))}
                className="btn-nasa w-100"
              >
                Aujourd'hui
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Informations du rover */}
      <Card className="nasa-card mb-4">
        <Card.Header>
          <h3>Informations sur {roverInfo.name}</h3>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Date de lancement:</strong> {roverInfo.launchDate}</p>
              <p><strong>Date d'atterrissage:</strong> {roverInfo.landingDate}</p>
            </Col>
            <Col md={6}>
              <p><strong>Statut:</strong> 
                <Badge bg={roverInfo.status === 'Active' ? 'success' : 'secondary'} className="ms-2">
                  {roverInfo.status}
                </Badge>
              </p>
              <p><strong>Description:</strong> {roverInfo.description}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Photos */}
      {photosLoading ? (
        <div className="nasa-loader">
          <div className="spinner-border spinner-border-nasa" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="loading-text">Chargement des photos de Mars...</p>
        </div>
      ) : photosError ? (
        <Alert variant="danger" className="error-container">
          <FaInfo className="error-icon" />
          <h4>Erreur lors du chargement</h4>
          <p className="error-message">
            {photosError.message || 'Impossible de récupérer les photos de Mars.'}
          </p>
        </Alert>
      ) : photosData?.data ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="nasa-card">
            <Card.Header>
              <h3>
                Photos de {roverInfo.name} - {new Date(selectedDate).toLocaleDateString('fr-FR')}
                <Badge bg="info" className="ms-2">
                  {photosData.data.photos?.length || 0} photos
                </Badge>
              </h3>
            </Card.Header>
            <Card.Body>
              {photosData.data.photos?.length > 0 ? (
                <div className="image-gallery">
                  {photosData.data.photos.map((photo) => (
                    <Card key={photo.id} className="nasa-card photo-card">
                      <Card.Body className="p-0">
                        <img
                          src={photo.img_src}
                          alt={`Mars ${photo.id}`}
                          className="nasa-image w-100"
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <div className="p-3">
                          <h6>Photo #{photo.id}</h6>
                          <p className="text-muted mb-2">
                            <strong>Caméra:</strong> {photo.camera?.full_name}
                          </p>
                          <p className="text-muted mb-2">
                            <strong>Date:</strong> {new Date(photo.earth_date).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-muted mb-2">
                            <strong>Sol:</strong> {photo.sol}
                          </p>
                          <Button
                            href={photo.img_src}
                            target="_blank"
                            variant="outline-primary"
                            size="sm"
                            className="w-100"
                          >
                            <FaCamera className="me-1" />
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
                  Aucune photo trouvée pour cette date et cette caméra.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </motion.div>
      ) : (
        <Alert variant="info" className="text-center">
          <FaInfo className="me-2" />
          Sélectionnez une date pour voir les photos.
        </Alert>
      )}
    </Container>
  );
};

export default MarsPage; 