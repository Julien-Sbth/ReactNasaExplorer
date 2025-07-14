import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navigation from './components/Navigation';
import StarsBackground from './components/StarsBackground';
import HomePage from './components/HomePage';
import ApodPage from './pages/ApodPage';
import NeoPage from './pages/NeoPage';
import MarsPage from './pages/MarsPage';
import EpicPage from './pages/EpicPage';
import ExoplanetsPage from './pages/ExoplanetsPage';
import DonkiPage from './pages/DonkiPage';
import TechTransferPage from './pages/TechTransferPage';
import InsightPage from './pages/InsightPage';
import NasaImagesPage from './pages/NasaImagesPage';
import LunarSamplesPage from './pages/LunarSamplesPage';
import AntarcticMeteoritesPage from './pages/AntarcticMeteoritesPage';
import NasaPowerPage from './pages/NasaPowerPage';
import StemPage from './pages/StemPage';
import EarthPage from './pages/EarthPage';
import FireballsPage from './pages/FireballsPage';
import { Analytics } from "@vercel/analytics/react";
import './App.css';

function App() {
  return (
    <div className="App">
      <Helmet>
        <title>NASA Data Explorer - React</title>
        <meta name="description" content="Une application web React moderne pour explorer les données ouvertes de la NASA" />
        <meta name="keywords" content="NASA, React, API, Espace, Astronomie, Données" />
        <meta name="author" content="Julien-Sbth" />
      </Helmet>
      
      <StarsBackground />
      <Navigation />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/apod" element={<ApodPage />} />
          <Route path="/neo" element={<NeoPage />} />
          <Route path="/mars" element={<MarsPage />} />
          <Route path="/epic" element={<EpicPage />} />
          <Route path="/exoplanets" element={<ExoplanetsPage />} />
          <Route path="/donki" element={<DonkiPage />} />
          <Route path="/techtransfer" element={<TechTransferPage />} />
          <Route path="/insight" element={<InsightPage />} />
          <Route path="/nasa-images" element={<NasaImagesPage />} />
          <Route path="/lunar-samples" element={<LunarSamplesPage />} />
          <Route path="/antarctic-meteorites" element={<AntarcticMeteoritesPage />} />
          <Route path="/nasa-power" element={<NasaPowerPage />} />
          <Route path="/stem" element={<StemPage />} />
          <Route path="/earth" element={<EarthPage />} />
          <Route path="/fireballs" element={<FireballsPage />} />
        </Routes>
      </main>
      <Analytics />
    </div>
  );
}

export default App; 