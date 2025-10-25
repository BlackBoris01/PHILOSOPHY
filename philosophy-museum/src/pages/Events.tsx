import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Events: React.FC = () => {
  useScrollAnimation();
  
  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <h1 className="page-title">Проекты и мероприятия</h1>
          <p className="lead">Лекции, конференции, фестивали и долгосрочные проекты</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Наши проекты</h2>
          <div className="project-details">

            {/* Комиксы о русских философах */}
            <article className="project-detail fade-in">
              <div className="project-detail__header">
                <h2 className="section-title">Комиксы о русских философах</h2>
                <div className="project-status">
                  <span className="status-badge status-active">В разработке</span>
                </div>
              </div>

              <div className="project-detail__content">
                <p className="lead">
                  Мы создаём серию иллюстрированных комиксов, посвящённых жизни и идеям русских мыслителей — от Василия
                  Розанова до Николая Бердяева.
                </p>

                <p>
                  Комиксы соединяют биографию, ключевые философские парадоксы и визуальный язык современной культуры.
                  Такой формат помогает подросткам и широкой аудитории познакомиться с философией через яркие образы и
                  захватывающий сюжет.
                </p>

                <h3>Особенности проекта</h3>
                <ul className="feature-list">
                  <li><strong>Доступность</strong> — сложные философские концепции представлены через понятные визуальные
                    образы</li>
                  <li><strong>Биографичность</strong> — каждая история основана на реальных событиях жизни философов</li>
                  <li><strong>Современность</strong> — использование актуальных художественных приёмов и стилей</li>
                  <li><strong>Образовательность</strong> — комиксы сопровождаются пояснительными материалами и источниками
                  </li>
                </ul>

                <h3>Планируемые выпуски</h3>
                <div className="comics-grid">
                  <div className="comic-preview">
                    <h4>«Розанов: философия повседневности»</h4>
                    <p>История о том, как Василий Розанов превращал бытовые мелочи в философские размышления</p>
                  </div>
                  <div className="comic-preview">
                    <h4>«Бердяев: бунт против необходимости»</h4>
                    <p>Путешествие через идеи свободы, творчества и человеческого достоинства</p>
                  </div>
                  <div className="comic-preview">
                    <h4>«Соловьёв: поиски всеединства»</h4>
                    <p>Философские искания Владимира Соловьёва и его мечта о духовном единстве мира</p>
                  </div>
                </div>
              </div>
            </article>

            {/* QR-боты */}
            <article className="project-detail fade-in delay-1">
              <div className="project-detail__header">
                <h2 className="section-title">QR-боты на мемориальных табличках</h2>
                <div className="project-status">
                  <span className="status-badge status-active">В разработке</span>
                </div>
              </div>

              <div className="project-detail__content">
                <p className="lead">
                  Каждая мемориальная табличка философу в Петербурге и других городах получает QR-код. Перейдя по нему,
                  можно попасть в диалог с «чат-ботом-философом».
                </p>

                <p>
                  Боты имитируют стиль и риторику мыслителей, позволяя задать им вопрос и получить ответ в духе их
                  текстов. Так философия оживает прямо на улицах города и становится частью городской интонации.
                </p>

                <h3>Как это работает</h3>
                <div className="process-steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h4>Находите табличку</h4>
                      <p>Обнаруживаете мемориальную табличку философу в городе</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h4>Сканируете QR-код</h4>
                      <p>Наводите камеру на QR-код и переходите в чат-бот</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h4>Общаетесь с философом</h4>
                      <p>Задаёте вопросы и получаете ответы в стиле мыслителя</p>
                    </div>
                  </div>
                </div>

                <h3>Доступные боты</h3>
                <div className="bots-grid">
                  <div className="bot-card">
                    <h4>🤔 Василий Розанов</h4>
                    <p>Специализируется на вопросах семьи, брака и повседневной жизни</p>
                  </div>
                  <div className="bot-card">
                    <h4>⚡ Николай Бердяев</h4>
                    <p>Готов обсуждать свободу, творчество и смысл существования</p>
                  </div>
                  <div className="bot-card">
                    <h4>🌍 Владимир Соловьёв</h4>
                    <p>Расскажет о всеединстве, любви и духовном развитии</p>
                  </div>
                </div>

                <div className="project-note">
                  <h4>💡 Инновационный подход</h4>
                  <p>
                    Проект объединяет традиционные мемориальные практики с современными технологиями,
                    создавая новый формат взаимодействия с философским наследием прямо в городском пространстве.
                  </p>
                </div>
              </div>
            </article>

          </div>
        </div>
      </section>
    </>
  );
};

export default Events;



