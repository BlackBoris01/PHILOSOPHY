import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Contacts: React.FC = () => {
  useScrollAnimation();
  
  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <h1 className="page-title">Контакты</h1>
          <p className="lead">Мы всегда рады ответить на ваши вопросы</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contacts-grid">

            <div className="contact-info">
              <h2 className="section-title">Как нас найти</h2>

              <div className="contact-item">
                <h3>📍 Адрес</h3>
                <p>
                  г. Санкт-Петербург, Невский проспект, д. 28<br/>
                  м. Невский проспект (3 минуты пешком)<br/>
                  м. Гостиный двор (7 минут пешком)
                </p>
              </div>

              <div className="contact-item">
                <h3>📞 Телефоны</h3>
                <p>
                  <strong>Справочная:</strong> +7 (812) 234-56-78<br/>
                  <strong>Экскурсии:</strong> +7 (812) 234-56-79<br/>
                  <strong>Мероприятия:</strong> +7 (812) 234-56-80
                </p>
              </div>

              <div className="contact-item">
                <h3>✉️ Email</h3>
                <p>
                  <strong>Общие вопросы:</strong> info@philmuseum.ru<br/>
                  <strong>Экскурсии:</strong> tours@philmuseum.ru<br/>
                  <strong>Пресс-служба:</strong> press@philmuseum.ru
                </p>
              </div>

              <div className="contact-item">
                <h3>🕒 Часы работы</h3>
                <div className="schedule-table">
                  <div className="schedule-row">
                    <span>Вторник — Четверг</span>
                    <span>10:00 — 20:00</span>
                  </div>
                  <div className="schedule-row">
                    <span>Пятница — Воскресенье</span>
                    <span>10:00 — 22:00</span>
                  </div>
                  <div className="schedule-row">
                    <span>Понедельник</span>
                    <span>Выходной</span>
                  </div>
                </div>
                <p className="muted" style={{marginTop: '8px'}}>Последний вход за час до закрытия</p>
              </div>

              <div className="contact-item">
                <h3>🎫 Стоимость билетов</h3>
                <div className="price-table">
                  <div className="price-row">
                    <span>Взрослый билет</span>
                    <span>400 ₽</span>
                  </div>
                  <div className="price-row">
                    <span>Льготный билет</span>
                    <span>200 ₽</span>
                  </div>
                  <div className="price-row">
                    <span>Студенческий билет</span>
                    <span>150 ₽</span>
                  </div>
                  <div className="price-row">
                    <span>Детский билет (до 16 лет)</span>
                    <span>Бесплатно</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-section">
              <h2 className="section-title">Напишите нам</h2>
              <form className="contact-form" style={{opacity: 0.6, pointerEvents: 'none'}}>
                <div className="form-group">
                  <label htmlFor="name">Ваше имя *</label>
                  <input type="text" id="name" name="name" required disabled />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input type="email" id="email" name="email" required disabled />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Телефон</label>
                  <input type="tel" id="phone" name="phone" disabled />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Тема обращения *</label>
                  <select id="subject" name="subject" required disabled>
                    <option value="">Выберите тему</option>
                    <option value="general">Общие вопросы</option>
                    <option value="tours">Экскурсии</option>
                    <option value="events">Мероприятия</option>
                    <option value="education">Образовательные программы</option>
                    <option value="media">Работа со СМИ</option>
                    <option value="cooperation">Сотрудничество</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Сообщение *</label>
                  <textarea id="message" name="message" rows={5} required disabled
                    placeholder="Расскажите, чем мы можем вам помочь..."></textarea>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" name="consent" required disabled />
                    Я согласен на обработку персональных данных *
                  </label>
                </div>

                <button type="submit" className="btn btn-primary" disabled>Отправить сообщение</button>
              </form>
              <p style={{marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '8px', textAlign: 'center'}}>
                <strong>Форма временно недоступна.</strong><br/>
                Пожалуйста, свяжитесь с нами по телефону или email.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Как добраться</h2>

          <div className="transport-info">
            <div className="transport-item">
              <h3>🚇 На метро</h3>
              <p>
                <strong>Невский проспект:</strong> выход к Казанскому собору, 3 минуты пешком по Невскому проспекту<br/>
                <strong>Гостиный двор:</strong> выход к Гостиному двору, 7 минут пешком
              </p>
            </div>

            <div className="transport-item">
              <h3>🚌 На автобусе</h3>
              <p>
                Автобусы: 3, 7, 22, 24, 27<br/>
                Троллейбусы: 1, 5, 7, 10, 11<br/>
                Остановка «Казанская площадь»
              </p>
            </div>

            <div className="transport-item">
              <h3>🚗 На автомобиле</h3>
              <p>
                Парковка на Думской улице<br/>
                Парковка у Гостиного двора<br/>
                Стоимость: от 100 ₽/час
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Следите за нами</h2>
          
          <div className="social-links">
            <a href="https://vk.com/philosophical_museum" className="social-link" target="_blank" rel="noopener">
              <div className="social-icon">📘</div>
              <div>
                <h3>ВКонтакте</h3>
                <p>Новости, мероприятия и обсуждения</p>
              </div>
            </a>

            <a href="https://t.me/MuseumofPhilosophy" className="social-link" target="_blank" rel="noopener">
              <div className="social-icon">💬</div>
              <div>
                <h3>Telegram</h3>
                <p>Анонсы событий и философские размышления</p>
              </div>
            </a>

            <a href="https://dzen.ru/filosofskiy_marshrut" className="social-link" target="_blank" rel="noopener">
              <div className="social-icon">📰</div>
              <div>
                <h3>Яндекс Дзен</h3>
                <p>Статьи и материалы «Философского маршрута»</p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contacts;
