import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Events from './pages/Events';
import Exhibitions from './pages/Exhibitions';
import Contacts from './pages/Contacts';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminPanel from './pages/AdminPanel';
import AdminContacts from './pages/AdminContacts';
import AdminAbout from './pages/AdminAbout';
import AdminExhibitions from './pages/AdminExhibitions';
import AdminEvents from './pages/AdminEvents';
import AdminHome from './pages/AdminHome';

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
          
          {/* Авторизация */}
          <Route path="/login" element={<Login />} />
          
          {/* Защищенные админ маршруты */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/news" element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/admin/contacts" element={
            <ProtectedRoute>
              <AdminContacts />
            </ProtectedRoute>
          } />
          
          {/* Временные маршруты для других разделов */}
          <Route path="/admin/home" element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          } />
          <Route path="/admin/about" element={
            <ProtectedRoute>
              <AdminAbout />
            </ProtectedRoute>
          } />
          <Route path="/admin/exhibitions" element={
            <ProtectedRoute>
              <AdminExhibitions />
            </ProtectedRoute>
          } />
          <Route path="/admin/events" element={
            <ProtectedRoute>
              <AdminEvents />
            </ProtectedRoute>
          } />
          
          {/* Fallback для несуществующих маршрутов */}
          <Route path="*" element={
            <div className="section page-hero">
              <div className="container">
                <h1 className="page-title">Страница не найдена</h1>
                <p className="lead">Запрашиваемая страница не существует</p>
                <a href="/" className="btn">Вернуться на главную</a>
              </div>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;



