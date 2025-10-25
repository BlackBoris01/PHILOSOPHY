import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Exhibitions: React.FC = () => {
  useScrollAnimation();
  
  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <h1 className="page-title">Экспозиции</h1>
          <p className="lead">Путешествие через века философской мысли</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Coming Soon Section */}
          <div className="coming-soon-simple">
            <h2 className="section-title">Экспозиции в разработке</h2>
            <p className="lead">
              Мы работаем над созданием уникальных экспозиций, которые представят философскую мысль через века и культуры.
              Следите за обновлениями на сайте и в наших социальных сетях.
            </p>
            <div className="coming-soon-info">
              <div className="info-item">
                <h3>Что нас ждёт</h3>
                <ul>
                  <li>Интерактивные экспозиции по истории философии</li>
                  <li>Мультимедийные инсталляции</li>
                  <li>Тематические выставки</li>
                  <li>Образовательные программы</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default Exhibitions;
