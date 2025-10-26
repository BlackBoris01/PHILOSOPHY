import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/philosophy-museum-logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link to="/" className="brand">
          <img src={logo} alt="Логотип музея философии" className="brand__logo" />
          <span className="brand__text">Музей философии</span>
        </Link>
        <div className="footer-right">
          <span className="muted"></span>
          <div className="socials">
            <a href="https://vk.com/philosophical_museum?from=groups" aria-label="VK" target="_blank" rel="noopener">vk</a>
            <a href="https://dzen.ru/filosofskiy_marshrut" aria-label="Яндекс Дзен" target="_blank" rel="noopener">dzen</a>
            <a href="https://t.me/MuseumofPhilosophy" aria-label="Telegram" target="_blank" rel="noopener">tg</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



