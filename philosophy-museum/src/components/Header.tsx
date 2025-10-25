import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/philosophy-museum-logo.png';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'is-active' : '';
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <img src={logo} alt="Логотип музея философии" className="brand__logo" />
          <span className="brand__text">Музей философии</span>
        </Link>
        
        <button 
          className="mobile-menu-toggle" 
          aria-label="Открыть меню"
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <nav className={`nav ${isMobileMenuOpen ? 'nav--open' : ''}`}>
          <Link to="/" className={`nav__link ${isActive('/')}`}>Главная</Link>
          <Link to="/about" className={`nav__link ${isActive('/about')}`}>О музее</Link>
          <Link to="/exhibitions" className={`nav__link ${isActive('/exhibitions')}`}>Экспозиции</Link>
          <Link to="/events" className={`nav__link ${isActive('/events')}`}>Проекты и мероприятия</Link>
          <Link to="/news" className={`nav__link ${isActive('/news')}`}>Новости</Link>
          <Link to="/contacts" className={`nav__link ${isActive('/contacts')}`}>Контакты</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

