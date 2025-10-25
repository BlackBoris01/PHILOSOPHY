import React from 'react';
import { Link } from 'react-router-dom';
import backgroundHome from '../assets/backgroundHome.jfif';
import discusThrower from '../assets/discus-thrower-sculpture.jpg';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Home: React.FC = () => {
  useScrollAnimation();
  
  return (
    <>
      {/* Hero Section */}
      <section id="hero" className="hero section fade-in">
        <div className="container hero__grid">
          <div className="hero__text">
            <p className="eyebrow">Первая философская институция музейного типа</p>
            <h1>Маршрут к бытию построен</h1>
            <p className="lead">
              Музей философии — это пространство, где мысль обретает форму, а вопросы оказываются важнее ответов.
              Мы стремимся сделать философию доступной и живой, показать её как часть культуры и повседневности.
            </p>
            <Link to="/about" className="btn">Узнать больше</Link>
          </div>
          <div className="hero__media">
            <img src={backgroundHome} alt="Библиотека философии" />
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section id="news" className="section news">
        <div className="container">
          <h2 className="section-title">Последние новости</h2>

          <article className="news-card slide-up">
            <h3>В Петербурге состоялось учредительное собрание первого в России музея философии <span className="meta">— 10 июля</span></h3>
            <p>
              8 июля 2025 года в музейно-выставочном центре «Петербургский художник» состоялось важное событие для
              культурной жизни города — круглый стол и учредительное собрание первого в России музея философии.
            </p>
            <p>
              Петербург — одна из интеллектуальных столиц России. Создание устойчивой площадки, объединяющей
              исследователей, художников, кураторов и горожан, позволит развивать просветительские программы и выставочные
              проекты.
            </p>
            <Link to="/news/1" className="btn btn-small">Читать далее</Link>
          </article>

          <article className="news-card with-image slide-up delay-1">
            <h3>Новый экспонат в коллекции — античная скульптура дисконоса <span className="meta">— 8 сентября</span></h3>
            <div className="news-card__grid">
              <div>
                <p>
                  В фондах музея появился значимый экспонат — копия знаменитой древнегреческой скульптуры
                  атлета‑дисконоса. Он будет представлен в рамках специальной экспозиции, посвящённой эстетике античности.
                </p>
                <p>
                  Образ атлета стал символом гармонии телесного и духовного. Мы готовим цикл публичных лекций и экскурсии
                  о роли спорта и состязаний в античном мире, а также специальные занятия для школьников и студентов.
                </p>
                <Link to="/news/2" className="btn btn-small">Читать далее</Link>
              </div>
              <figure className="news-card__media">
                <img
                  src={discusThrower}
                  alt="Античная скульптура дисконоса" />
                <figcaption>Новый экспонат в музее</figcaption>
              </figure>
            </div>
          </article>
        </div>
      </section>

      {/* Mission */}
      <section id="about" className="section facts section-alt">
        <div className="container">
          <h2 className="section-title">Наша миссия</h2>
          <p className="lead" style={{textAlign: 'center', marginBottom: '40px'}}>
            Создание новой культурной институции, где философия становится доступной, понятной и живой частью общественной
            жизни.
          </p>
          <div className="facts__grid">
            <div className="fact fade-in">
              <div className="fact__icon">💭</div>
              <h3>Философия как диалог</h3>
              <p>Создаём площадку для общения философов, студентов, школьников и широкой аудитории.</p>
            </div>
            <div className="fact fade-in delay-1">
              <div className="fact__icon">🎯</div>
              <h3>Философия как практика</h3>
              <p>Лекции, дискуссии, квесты и мультимедийные проекты позволяют проживать философские идеи.</p>
            </div>
            <div className="fact fade-in delay-2">
              <div className="fact__icon">🌉</div>
              <h3>Философия как культурный мост</h3>
              <p>Соединяем русскую философскую традицию с современными гуманитарными технологиями.</p>
            </div>
            <div className="fact fade-in delay-3">
              <div className="fact__icon">🏛️</div>
              <h3>Философия как память</h3>
              <p>Увековечиваем имена мыслителей через таблички, маршруты и мультимедийные проекты.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Preview */}
      <section id="events" className="section events">
        <div className="container">
          <h2 className="section-title">Анонсы событий</h2>
          <div className="events-preview">
            <div className="event-preview slide-up">
              <div className="event-preview__date">
                <span className="day">22</span>
                <span className="month">окт</span>
              </div>
              <div className="event-preview__info">
                <h3>Лекция «Пещера Платона в цифровую эпоху»</h3>
                <p className="event-preview__time">19:00</p>
                <p>Как древняя аллегория помогает понять современные медиа</p>
              </div>
            </div>

            <div className="event-preview slide-up delay-1">
              <div className="event-preview__date">
                <span className="day">15-17</span>
                <span className="month">окт</span>
              </div>
              <div className="event-preview__info">
                <h3>Московский фестиваль философии</h3>
                <p className="event-preview__time">Весь день</p>
                <p>Трёхдневный фестиваль с участием ведущих философов</p>
              </div>
            </div>

            <div className="event-preview slide-up delay-2">
              <div className="event-preview__date">
                <span className="day">28</span>
                <span className="month">окт</span>
              </div>
              <div className="event-preview__info">
                <h3>Мастер-класс по критическому мышлению</h3>
                <p className="event-preview__time">14:00</p>
                <p>Практические навыки анализа информации</p>
              </div>
            </div>
          </div>

          <div style={{textAlign: 'center', marginTop: '32px'}}>
            <Link to="/events" className="btn">Все мероприятия</Link>
          </div>
        </div>
      </section>

      {/* Social Networks */}
      <section className="section social-section">
        <div className="container">
          <h2 className="section-title">Следите за нами</h2>
          <p className="lead" style={{textAlign: 'center', marginBottom: '40px'}}>
            Присоединяйтесь к нашему сообществу в социальных сетях
          </p>
          <div className="social-links">
            <a href="https://vk.com/philosophical_museum" className="social-link" target="_blank" rel="noopener">
              <div className="social-icon">📘</div>
              <span className="social-name">ВКонтакте</span>
              <span className="social-desc">Новости и обсуждения</span>
            </a>
            <a href="https://t.me/MuseumofPhilosophy" className="social-link" target="_blank" rel="noopener">
              <div className="social-icon">💬</div>
              <span className="social-name">Telegram</span>
              <span className="social-desc">Новости и обсуждения</span>
            </a>
            <a href="https://dzen.ru/filosofskiy_marshrut" className="social-link" target="_blank" rel="noopener noreferrer">
              <div className="social-icon">📰</div>
              <span className="social-name">Яндекс Дзен</span>
              <span className="social-desc">Философский маршрут</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;



