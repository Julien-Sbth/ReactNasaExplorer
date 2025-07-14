import axios from 'axios';

// Configuration de base pour les APIs NASA
const NASA_API_KEY = process.env.REACT_APP_NASA_API_KEY || 'DEMO_KEY';

// Instance axios configurée
const nasaApi = axios.create({
  baseURL: 'https://api.nasa.gov',
  timeout: 10000,
});

// Intercepteur pour ajouter la clé API automatiquement
nasaApi.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    api_key: NASA_API_KEY,
  };
  return config;
});

// Endpoints des APIs NASA - Toutes les APIs disponibles sur api.nasa.gov
const ENDPOINTS = {
  // APOD - Astronomy Picture of the Day
  apod: '/planetary/apod',
  
  // NEO - Near Earth Objects
  neo: '/neo/rest/v1/feed',
  neoLookup: '/neo/rest/v1/lookup',
  neoBrowse: '/neo/rest/v1/browse',
  
  // Mars Photos
  marsPhotos: '/mars-photos/api/v1/rovers',
  
  // EPIC - Earth Polychromatic Imaging Camera
  epic: '/EPIC/api',
  
  // DONKI - Space Weather Database
  donki: '/DONKI',
  
  // TechTransfer
  techTransfer: '/techtransfer/patent',
  
  // InSight Weather
  insightWeather: '/insight_weather',
  
  // TLE - Two Line Elements
  tle: '/TLE',
  
  // NASA Images and Video Library
  nasaImages: 'https://images-api.nasa.gov/search',
  nasaImagesAsset: 'https://images-api.nasa.gov/asset',
  nasaImagesMetadata: 'https://images-api.nasa.gov/metadata',
  
  // Exoplanets (API externe)
  exoplanets: 'https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI',
  
  // Lunar Sample API
  lunarSamples: 'https://curator.jsc.nasa.gov/lunar/sample/api',
  
  // Antarctic Meteorite API
  antarcticMeteorites: 'https://curator.jsc.nasa.gov/antmet/sample/api',
  
  // NASA POWER (Prediction Of Worldwide Energy Resources)
  nasaPower: 'https://power.larc.nasa.gov/api',
  
  // Solar System Bodies
  solarSystemBodies: '/planetary/rest/bodies',
  
  // Asteroid NeoWs (Near Earth Object Web Service)
  asteroidNeoWs: '/neo/rest/v1',
  
  // Mars Weather API
  marsWeather: '/insight_weather',
  
  // NASA Patents
  nasaPatents: '/techtransfer/patent',
  
  // NASA Software
  nasaSoftware: '/techtransfer/software',
  
  // NASA Spinoff
  nasaSpinoff: '/techtransfer/spinoff',
  
  // NASA TechPort
  nasaTechPort: '/techport/api/projects',
  
  // NASA GeneLab
  nasaGeneLab: 'https://genelab.nasa.gov/api',
  
  // NASA STEM
  nasaStem: 'https://api.nasa.gov/stem',
  
  // NASA SoundCloud
  nasaSoundCloud: 'https://api.nasa.gov/sounds',
  
  // NASA Library
  nasaLibrary: 'https://api.nasa.gov/library',
  
  // NASA SVS (Scientific Visualization Studio)
  nasaSVS: 'https://svs.gsfc.nasa.gov/api',
  
  // NASA Earth
  nasaEarth: 'https://api.nasa.gov/planetary/earth',
  
  // NASA Asteroids
  nasaAsteroids: '/neo/rest/v1/feed',
  
  // NASA Comets
  nasaComets: '/neo/rest/v1/comets',
  
  // NASA Fireballs
  nasaFireballs: '/fireballs',
  
  // NASA Sentry
  nasaSentry: '/sentry',
  
  // NASA Scout
  nasaScout: '/scout',
  
  // NASA Cad
  nasaCad: '/cad',
  
  // NASA JPL Small-Body Database
  nasaJPLSmallBody: 'https://ssd-api.jpl.nasa.gov',
  
  // NASA HORIZONS System
  nasaHorizons: 'https://ssd-api.jpl.nasa.gov/horizons.api',
  
  // NASA SBDB (Small-Body Database)
  nasaSBDB: 'https://ssd-api.jpl.nasa.gov/sbdb.api',
  
  // NASA Orbit Database
  nasaOrbitDB: 'https://ssd-api.jpl.nasa.gov/orbit.api',
  
  // NASA Physical Properties Database
  nasaPhysicalDB: 'https://ssd-api.jpl.nasa.gov/physical_properties.api',
  
  // NASA Close-Approach Data
  nasaCloseApproach: 'https://ssd-api.jpl.nasa.gov/cad.api',
  
  // NASA Discovery Statistics
  nasaDiscoveryStats: 'https://ssd-api.jpl.nasa.gov/discovery_stats.api',
  
  // NASA Orbit Determination
  nasaOrbitDetermination: 'https://ssd-api.jpl.nasa.gov/orbit_determination.api',
  
  // NASA Impact Risk Assessment
  nasaImpactRisk: 'https://ssd-api.jpl.nasa.gov/impact_risk.api',
  
  // NASA Trajectory Browser
  nasaTrajectoryBrowser: 'https://trajbrowser.arc.nasa.gov/api',
  
  // NASA Space Weather
  nasaSpaceWeather: 'https://api.nasa.gov/DONKI',
  
  // NASA Heliophysics
  nasaHeliophysics: 'https://api.nasa.gov/planetary/heliophysics',
  
  // NASA Astrophysics
  nasaAstrophysics: 'https://api.nasa.gov/planetary/astrophysics',
  
  // NASA Planetary Science
  nasaPlanetaryScience: 'https://api.nasa.gov/planetary',
  
  // NASA Earth Science
  nasaEarthScience: 'https://api.nasa.gov/earth',
  
  // NASA Biological and Physical Sciences
  nasaBiologicalPhysical: 'https://api.nasa.gov/bps',
  
  // NASA Human Exploration and Operations
  nasaHumanExploration: 'https://api.nasa.gov/heo',
  
  // NASA Aeronautics Research
  nasaAeronautics: 'https://api.nasa.gov/aeronautics',
  
  // NASA Space Technology
  nasaSpaceTechnology: 'https://api.nasa.gov/space_technology',
  
  // NASA Education
  nasaEducation: 'https://api.nasa.gov/education',
  
  // NASA Public Affairs
  nasaPublicAffairs: 'https://api.nasa.gov/public_affairs',
  
  // NASA History
  nasaHistory: 'https://api.nasa.gov/history',
  
  // NASA Technology Transfer
  nasaTechnologyTransfer: 'https://api.nasa.gov/techtransfer',
  
  // NASA Software Catalog
  nasaSoftwareCatalog: 'https://software.nasa.gov/api',
  
  // NASA Spinoff Database
  nasaSpinoffDB: 'https://spinoff.nasa.gov/api',
  
  // NASA TechPort Projects
  nasaTechPortProjects: 'https://techport.nasa.gov/api/projects',
  
  // NASA GeneLab Data
  nasaGeneLabData: 'https://genelab.nasa.gov/api/data',
  
  // NASA STEM Activities
  nasaStemActivities: 'https://api.nasa.gov/stem/activities',
  
  // NASA STEM Resources
  nasaStemResources: 'https://api.nasa.gov/stem/resources',
  
  // NASA STEM Events
  nasaStemEvents: 'https://api.nasa.gov/stem/events',
  
  // NASA STEM Challenges
  nasaStemChallenges: 'https://api.nasa.gov/stem/challenges',
  
  // NASA STEM Competitions
  nasaStemCompetitions: 'https://api.nasa.gov/stem/competitions',
  
  // NASA STEM Internships
  nasaStemInternships: 'https://api.nasa.gov/stem/internships',
  
  // NASA STEM Scholarships
  nasaStemScholarships: 'https://api.nasa.gov/stem/scholarships',
  
  // NASA STEM Fellowships
  nasaStemFellowships: 'https://api.nasa.gov/stem/fellowships',
  
  // NASA STEM Grants
  nasaStemGrants: 'https://api.nasa.gov/stem/grants',
  
  // NASA STEM Programs
  nasaStemPrograms: 'https://api.nasa.gov/stem/programs',
  
  // NASA STEM Centers
  nasaStemCenters: 'https://api.nasa.gov/stem/centers',
  
  // NASA STEM Partners
  nasaStemPartners: 'https://api.nasa.gov/stem/partners',
  
  // NASA STEM Networks
  nasaStemNetworks: 'https://api.nasa.gov/stem/networks',
  
  // NASA STEM Outreach
  nasaStemOutreach: 'https://api.nasa.gov/stem/outreach',
  
  // NASA STEM Education
  nasaStemEducation: 'https://api.nasa.gov/stem/education',
  
  // NASA STEM Research
  nasaStemResearch: 'https://api.nasa.gov/stem/research',
  
  // NASA STEM Innovation
  nasaStemInnovation: 'https://api.nasa.gov/stem/innovation',
  
  // NASA STEM Technology
  nasaStemTechnology: 'https://api.nasa.gov/stem/technology',
  
  // NASA STEM Engineering
  nasaStemEngineering: 'https://api.nasa.gov/stem/engineering',
  
  // NASA STEM Mathematics
  nasaStemMathematics: 'https://api.nasa.gov/stem/mathematics',
  
  // NASA STEM Science
  nasaStemScience: 'https://api.nasa.gov/stem/science',
};

// Service APOD
export const apodService = {
  getToday: () => nasaApi.get(ENDPOINTS.apod),
  getByDate: (date) => nasaApi.get(ENDPOINTS.apod, { params: { date } }),
  getRange: (startDate, endDate) => 
    nasaApi.get(ENDPOINTS.apod, { params: { start_date: startDate, end_date: endDate } }),
  getRandom: (count = 10) => 
    nasaApi.get(ENDPOINTS.apod, { params: { count } }),
};

// Service NEO (Near Earth Objects)
export const neoService = {
  getFeed: (startDate, endDate) => 
    nasaApi.get(ENDPOINTS.neo, { params: { start_date: startDate, end_date: endDate } }),
  lookup: (asteroidId) => 
    nasaApi.get(`${ENDPOINTS.neoLookup}/${asteroidId}`),
  browse: (page = 0, size = 20) => 
    nasaApi.get(ENDPOINTS.neoBrowse, { params: { page, size } }),
};

// Service Mars Photos
export const marsPhotosService = {
  getRovers: () => nasaApi.get(ENDPOINTS.marsPhotos),
  getPhotos: (rover, params = {}) => 
    nasaApi.get(`${ENDPOINTS.marsPhotos}/${rover}/photos`, { params }),
  getManifests: (rover) => 
    nasaApi.get(`${ENDPOINTS.marsPhotos}/${rover}`),
};

// Service EPIC
export const epicService = {
  getRecent: () => nasaApi.get(`${ENDPOINTS.epic}/natural/recent`),
  getByDate: (date) => nasaApi.get(`${ENDPOINTS.epic}/natural/date/${date}`),
  getAvailable: () => nasaApi.get(`${ENDPOINTS.epic}/natural/available`),
  getImageUrl: (date, image) => 
    `https://epic.gsfc.nasa.gov/archive/natural/${date.replace(/-/g, '/')}/png/${image}.png`,
};

// Service DONKI
export const donkiService = {
  getCME: (startDate, endDate) => 
    nasaApi.get(`${ENDPOINTS.donki}/CME`, { params: { startDate, endDate } }),
  getSolarFlare: (startDate, endDate) => 
    nasaApi.get(`${ENDPOINTS.donki}/FLR`, { params: { startDate, endDate } }),
  getGeomagneticStorm: (startDate, endDate) => 
    nasaApi.get(`${ENDPOINTS.donki}/GST`, { params: { startDate, endDate } }),
  getInterplanetaryShock: (startDate, endDate) => 
    nasaApi.get(`${ENDPOINTS.donki}/IPS`, { params: { startDate, endDate } }),
  getSolarEnergeticParticle: (startDate, endDate) => 
    nasaApi.get(`${ENDPOINTS.donki}/SEP`, { params: { startDate, endDate } }),
  getMagnetopauseCrossing: (startDate, endDate) => 
    nasaApi.get(`${ENDPOINTS.donki}/MPC`, { params: { startDate, endDate } }),
  getRadiationBeltEnhancement: (startDate, endDate) => 
    nasaApi.get(`${ENDPOINTS.donki}/RBE`, { params: { startDate, endDate } }),
  getHightSpeedStream: (startDate, endDate) => 
    nasaApi.get(`${ENDPOINTS.donki}/HSS`, { params: { startDate, endDate } }),
  getWSA: (startDate, endDate) => 
    nasaApi.get(`${ENDPOINTS.donki}/WSA`, { params: { startDate, endDate } }),
  getNotifications: (startDate, endDate) => 
    nasaApi.get(`${ENDPOINTS.donki}/notifications`, { params: { startDate, endDate } }),
};

// Service TechTransfer
export const techTransferService = {
  getPatents: (query = '') => 
    nasaApi.get(ENDPOINTS.techTransfer, { params: { query } }),
  getSoftware: (query = '') => 
    nasaApi.get(ENDPOINTS.nasaSoftware, { params: { query } }),
  getSpinoffs: (query = '') => 
    nasaApi.get(ENDPOINTS.nasaSpinoff, { params: { query } }),
};

// Service Exoplanets (API externe)
export const exoplanetsService = {
  getConfirmed: () => 
    axios.get('https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=cumulative&select=*'),
  getKepler: () => 
    axios.get(`${ENDPOINTS.exoplanets}?table=keplercandidates&select=*`),
  getTESS: () => 
    axios.get(`${ENDPOINTS.exoplanets}?table=ticv8&select=*`),
  getK2: () => 
    axios.get(`${ENDPOINTS.exoplanets}?table=k2candidates&select=*`),
};

// Service NASA Images
export const nasaImagesService = {
  search: (query, params = {}) => 
    axios.get(ENDPOINTS.nasaImages, { params: { q: query, ...params } }),
  getAsset: (nasaId) => 
    axios.get(`${ENDPOINTS.nasaImagesAsset}/${nasaId}`),
  getMetadata: (nasaId) => 
    axios.get(`${ENDPOINTS.nasaImagesMetadata}/${nasaId}`),
};

// Service InSight Weather
export const insightWeatherService = {
  getWeather: () => nasaApi.get(ENDPOINTS.insightWeather),
};

// Service TLE
export const tleService = {
  getTLE: (noradId) => 
    nasaApi.get(`${ENDPOINTS.tle}/${noradId}`),
};

// Service Lunar Samples
export const lunarSamplesService = {
  getSamples: (params = {}) => 
    axios.get(ENDPOINTS.lunarSamples, { params }),
  getSample: (id) => 
    axios.get(`${ENDPOINTS.lunarSamples}/${id}`),
};

// Service Antarctic Meteorites
export const antarcticMeteoritesService = {
  getMeteorites: (params = {}) => 
    axios.get(ENDPOINTS.antarcticMeteorites, { params }),
  getMeteorite: (id) => 
    axios.get(`${ENDPOINTS.antarcticMeteorites}/${id}`),
};

// Service NASA POWER
export const nasaPowerService = {
  getData: (params = {}) => 
    axios.get(ENDPOINTS.nasaPower, { params }),
  getClimatology: (params = {}) => 
    axios.get(`${ENDPOINTS.nasaPower}/climatology`, { params }),
  getStatistics: (params = {}) => 
    axios.get(`${ENDPOINTS.nasaPower}/statistics`, { params }),
};

// Service Solar System Bodies
export const solarSystemBodiesService = {
  getBodies: () => 
    nasaApi.get(ENDPOINTS.solarSystemBodies),
  getBody: (id) => 
    nasaApi.get(`${ENDPOINTS.solarSystemBodies}/${id}`),
};

// Service Fireballs
export const fireballsService = {
  getFireballs: (params = {}) => 
    nasaApi.get(ENDPOINTS.nasaFireballs, { params }),
};

// Service Sentry
export const sentryService = {
  getSentry: (params = {}) => 
    nasaApi.get(ENDPOINTS.nasaSentry, { params }),
};

// Service Scout
export const scoutService = {
  getScout: (params = {}) => 
    nasaApi.get(ENDPOINTS.nasaScout, { params }),
};

// Service CAD (Close Approach Data)
export const cadService = {
  getCAD: (params = {}) => 
    nasaApi.get(ENDPOINTS.nasaCad, { params }),
};

// Service Earth
export const earthService = {
  getAssets: (lat, lon, date) => 
    nasaApi.get(ENDPOINTS.nasaEarth + '/assets', { params: { lat, lon, date } }),
  getImagery: (lat, lon, date, dim = 0.15) => 
    nasaApi.get(ENDPOINTS.nasaEarth + '/imagery', { params: { lat, lon, date, dim } }),
};

// Service STEM
export const stemService = {
  getActivities: (params = {}) => 
    axios.get(ENDPOINTS.nasaStemActivities, { params }),
  getResources: (params = {}) => 
    axios.get(ENDPOINTS.nasaStemResources, { params }),
  getEvents: (params = {}) => 
    axios.get(ENDPOINTS.nasaStemEvents, { params }),
  getChallenges: (params = {}) => 
    axios.get(ENDPOINTS.nasaStemChallenges, { params }),
  getCompetitions: (params = {}) => 
    axios.get(ENDPOINTS.nasaStemCompetitions, { params }),
  getInternships: (params = {}) => 
    axios.get(ENDPOINTS.nasaStemInternships, { params }),
  getScholarships: (params = {}) => 
    axios.get(ENDPOINTS.nasaStemScholarships, { params }),
  getFellowships: (params = {}) => 
    axios.get(ENDPOINTS.nasaStemFellowships, { params }),
  getGrants: (params = {}) => 
    axios.get(ENDPOINTS.nasaStemGrants, { params }),
  getPrograms: (params = {}) => 
    axios.get(ENDPOINTS.nasaStemPrograms, { params }),
  getCenters: (params = {}) => 
    axios.get(ENDPOINTS.nasaStemCenters, { params }),
  getPartners: (params = {}) => 
    axios.get(ENDPOINTS.nasaStemPartners, { params }),
  getNetworks: (params = {}) => 
    axios.get(ENDPOINTS.nasaStemNetworks, { params }),
  getOutreach: (params = {}) => 
    axios.get(ENDPOINTS.nasaStemOutreach, { params }),
  getEducation: (params = {}) => 
    axios.get(ENDPOINTS.nasaStemEducation, { params }),
  getResearch: (params = {}) => 
    axios.get(ENDPOINTS.nasaStemResearch, { params }),
  getInnovation: (params = {}) => 
    axios.get(ENDPOINTS.nasaStemInnovation, { params }),
  getTechnology: (params = {}) => 
    axios.get(ENDPOINTS.nasaStemTechnology, { params }),
  getEngineering: (params = {}) => 
    axios.get(ENDPOINTS.nasaStemEngineering, { params }),
  getMathematics: (params = {}) => 
    axios.get(ENDPOINTS.nasaStemMathematics, { params }),
  getScience: (params = {}) => 
    axios.get(ENDPOINTS.nasaStemScience, { params }),
};

// Service GeneLab
export const geneLabService = {
  getData: (params = {}) => 
    axios.get(ENDPOINTS.nasaGeneLabData, { params }),
  getStudies: (params = {}) => 
    axios.get(`${ENDPOINTS.nasaGeneLab}/studies`, { params }),
  getExperiments: (params = {}) => 
    axios.get(`${ENDPOINTS.nasaGeneLab}/experiments`, { params }),
  getSamples: (params = {}) => 
    axios.get(`${ENDPOINTS.nasaGeneLab}/samples`, { params }),
  getFiles: (params = {}) => 
    axios.get(`${ENDPOINTS.nasaGeneLab}/files`, { params }),
};

// Service TechPort
export const techPortService = {
  getProjects: (params = {}) => 
    axios.get(ENDPOINTS.nasaTechPortProjects, { params }),
  getProject: (id) => 
    axios.get(`${ENDPOINTS.nasaTechPortProjects}/${id}`),
};

// Service SVS (Scientific Visualization Studio)
export const svsService = {
  getVisualizations: (params = {}) => 
    axios.get(ENDPOINTS.nasaSVS, { params }),
  getVisualization: (id) => 
    axios.get(`${ENDPOINTS.nasaSVS}/${id}`),
};

// Service Library
export const libraryService = {
  getItems: (params = {}) => 
    axios.get(ENDPOINTS.nasaLibrary, { params }),
  getItem: (id) => 
    axios.get(`${ENDPOINTS.nasaLibrary}/${id}`),
};

// Service SoundCloud
export const soundCloudService = {
  getSounds: (params = {}) => 
    axios.get(ENDPOINTS.nasaSoundCloud, { params }),
  getSound: (id) => 
    axios.get(`${ENDPOINTS.nasaSoundCloud}/${id}`),
};

// Fonctions utilitaires
export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

export const getDateRange = (days = 7) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};

// Gestion des erreurs
export const handleApiError = (error) => {
  if (error.response) {
    // Erreur de réponse du serveur
    console.error('API Error:', error.response.data);
    return {
      error: true,
      message: error.response.data.error_message || 'Erreur lors de la récupération des données',
      status: error.response.status,
    };
  } else if (error.request) {
    // Erreur de réseau
    console.error('Network Error:', error.request);
    return {
      error: true,
      message: 'Erreur de connexion réseau',
      status: 0,
    };
  } else {
    // Autre erreur
    console.error('Error:', error.message);
    return {
      error: true,
      message: 'Une erreur inattendue s\'est produite',
      status: -1,
    };
  }
};

export default nasaApi; 