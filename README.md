# NASA Data Explorer (React)

A modern React web application to explore NASA's open data APIs. Discover the wonders of space through interactive visualizations, images, planetary data, meteorites, space weather, and much more—all in a beautiful, responsive interface.

## 🚀 Features

- **APOD (Astronomy Picture of the Day):** View NASA's daily space image with explanations.
- **NEO Asteroids:** Track near-Earth objects and asteroids.
- **Mars Photos:** Explore Mars through rover images.
- **Earth Images (EPIC):** See real-time satellite images of Earth.
- **Exoplanets:** Discover extrasolar planets and their properties.
- **Space Weather (DONKI):** Monitor solar storms and space weather events.
- **Tech Transfer:** Browse NASA's patents and technological innovations.
- **InSight Weather:** Check historical weather data from Mars.
- **NASA Images & Video Library:** Search and view NASA's vast multimedia collection.
- **Lunar Samples:** Explore rocks and dust from the Apollo missions.
- **Antarctic Meteorites:** Learn about meteorites found in Antarctica.
- **NASA POWER:** Analyze global climate and energy data.
- **STEM Education:** Access educational resources for all ages.
- **Earth Data:** Examine satellite and geospatial data of Earth.
- **Fireballs:** Track fireballs and meteors detected worldwide.

## 🖥️ Demo

> _No live demo provided. Run locally by following the instructions below._

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd ReactNasaAPI
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up NASA API Key (optional but recommended):**
   - Create a `.env` file at the root of the project.
   - Add your NASA API key (get one for free at [api.nasa.gov](https://api.nasa.gov/)):
     ```env
     REACT_APP_NASA_API_KEY=your_nasa_api_key_here
     ```
   - If not set, the app will use NASA's `DEMO_KEY` (with limited rate limits).

## ▶️ Usage

- **Start the development server:**
  ```bash
  npm start
  ```
- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Explore the various NASA datasets using the navigation bar and feature cards.

## 🛠️ Tech Stack

- **React 18**
- **React Router 6**
- **React Bootstrap 5**
- **Framer Motion** (animations)
- **React Query** (data fetching & caching)
- **Axios** (API requests)
- **NASA Open APIs**

## 📁 Project Structure

- `src/components/` — Navigation, HomePage, and shared UI components
- `src/pages/` — One file per NASA dataset/feature (APOD, Mars, NEO, etc.)
- `src/services/nasaApi.js` — All API calls and endpoints
- `public/` — Static files and HTML template

## 🔑 NASA API Key

- Most features use NASA's public APIs, which require an API key.
- You can use the default `DEMO_KEY`, but it is **rate-limited**.
- For production or heavy use, [get your own API key](https://api.nasa.gov/).
- Place your key in a `.env` file as described above.

## 📝 License

This project is for educational and demonstration purposes. NASA data is public domain, but check individual API terms for usage restrictions.

---

**Author:** Julien-Sbth

Inspired by the wonders of the universe and NASA's open data mission. 