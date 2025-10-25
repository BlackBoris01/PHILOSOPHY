import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Events from './pages/Events';
import Exhibitions from './pages/Exhibitions';
import Contacts from './pages/Contacts';
import AdminPanel from './pages/AdminPanel';

function App() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = React.useState(location);
  const [transitionStage, setTransitionStage] = React.useState('fadeIn');

  React.useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut');
    }
  }, [location, displayLocation]);

  return (
    <div className="App">
      <Header />
      <main
        className={`page-transition ${transitionStage}`}
        onTransitionEnd={() => {
          if (transitionStage === 'fadeOut') {
            setTransitionStage('fadeIn');
            setDisplayLocation(location);
            window.scrollTo(0, 0);
          }
        }}
      >
        <Routes location={displayLocation}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/exhibitions" element={<Exhibitions />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;



