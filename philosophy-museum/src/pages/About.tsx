import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const About: React.FC = () => {
  useScrollAnimation();
  
  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <h1 className="page-title">О музее</h1>
          <p className="lead">Первая философская институция музейного типа в России</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="content-grid">
            <div className="content-main">
              <h2 className="section-title">О музее</h2>
              <p>
                Музей философии — это пространство, где мысль обретает форму, а вопросы оказываются важнее ответов.
                Мы стремимся сделать философию доступной и живой, показать её как часть культуры и повседневности.
              </p>

              <p>
                Наша миссия — создать диалог между философией и современным обществом, соединяя наследие русской и мировой
                мысли с актуальными гуманитарными практиками.
              </p>

              <blockquote className="quote">
                <p>«Первая философская институция музейного типа. Маршрут к бытию построен»</p>
                <cite>— Девиз музея</cite>
              </blockquote>

              <h2 className="section-title">Философия как городская интонация</h2>
              <p>
                Мы рассматриваем философию как городскую интонацию: в ритме улиц, в архитектуре, в повседневной речи можно
                услышать эхо идей мыслителей. Именно поэтому музей работает не только как выставочное пространство, но и
                как инициатор философских маршрутов, прогулок, дискуссий и квестов.
              </p>

              <p>
                Музей вырос из инициативы «Философский маршрут» и сегодня развивается в рамках АНО «Центр философских
                институций». Здесь соединяются экспозиции, медиа, образовательные программы и культурные проекты,
                превращая философию в реальный опыт для всех поколений.
              </p>

              <h2 className="section-title">Наши ценности</h2>
              <ul className="feature-list">
                <li><strong>Философия как диалог</strong> — мы создаём площадку для общения философов, студентов,
                  школьников и широкой аудитории</li>
                <li><strong>Философия как практика</strong> — лекции, дискуссии, квесты и мультимедийные проекты позволяют
                  проживать философские идеи, а не только читать о них</li>
                <li><strong>Философия как культурный мост</strong> — соединяем русскую философскую традицию с современными
                  гуманитарными технологиями, включая медиа, искусство и цифровые форматы</li>
                <li><strong>Философия как память</strong> — увековечиваем имена мыслителей через таблички, маршруты и
                  мультимедийные проекты (например, «12 месяцев русской философии»)</li>
              </ul>

              <h2 className="section-title">Что мы объединяем</h2>
              <div className="activities-grid">
                <div className="activity-card fade-in">
                  <div className="activity-icon">🎨</div>
                  <h3>Экспозиции и мультимедиа</h3>
                  <p>Античная философия, 12 месяцев русской философии и другие мультимедийные инсталляции</p>
                </div>
                <div className="activity-card fade-in delay-1">
                  <div className="activity-icon">🎯</div>
                  <h3>Культурные проекты</h3>
                  <p>Философские квесты, комиксы, чат-боты, премии «Философ года» и «Философская инициатива года»</p>
                </div>
                <div className="activity-card fade-in delay-2">
                  <div className="activity-icon">📱</div>
                  <h3>Медиаплатформа</h3>
                  <p>«Философский маршрут»: статьи, эссе, интервью, подкасты</p>
                </div>
                <div className="activity-card fade-in delay-3">
                  <div className="activity-icon">🤝</div>
                  <h3>Партнёрские программы</h3>
                  <p>Сотрудничество с университетами, культурными центрами и издательствами</p>
                </div>
              </div>
            </div>

            <aside className="content-sidebar">
              <div className="info-card">
                <h3>Часы работы</h3>
                <p>Вторник — Воскресенье<br/>10:00 — 20:00</p>
                <p>Понедельник — выходной</p>
              </div>

              <div className="info-card">
                <h3>Стоимость билетов</h3>
                <p>Взрослый: 400 ₽<br/>
                  Льготный: 200 ₽<br/>
                  Студенческий: 150 ₽</p>
              </div>

              <div className="info-card">
                <h3>Контакты</h3>
                <p>+7 (495) 123-45-67<br/>
                  info@philmuseum.ru</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Учредители и руководство АНО «Центр философских институций»</h2>
          <p className="lead" style={{textAlign: 'center', marginBottom: '40px'}}>
            Организационная структура и руководящий состав центра
          </p>

          <div className="leadership-grid">
            <div className="leadership-member fade-in">
              <div className="avatar-placeholder">ДА</div>
              <h3>Дмитриев Анатолий Владимирович</h3>
              <p className="role">Секретарь научного совета</p>
              <p>директор центра фил.институций, главред "Философского маршрута"</p>
            </div>

            <div className="leadership-member fade-in delay-1">
              <div className="avatar-placeholder">СВ</div>
              <h3>Савчук Валерий Владимирович</h3>
              <p className="role">Заместитель директора по науке АНО</p>
              <p>Доктор философских наук, профессор, директор Центра медиафилософии ИФ СПбГУ</p>
            </div>

            <div className="leadership-member fade-in delay-2">
              <div className="avatar-placeholder">БВ</div>
              <h3>Байков Владимир Борисович</h3>
              <p className="role">Заместитель директора по развитию</p>
              <p>Специалист по стратегическому развитию культурных институций</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Научный совет Музея философии</h2>
          <p className="lead" style={{textAlign: 'center', marginBottom: '40px'}}>
            Экспертное ядро музея, объединяющее философов, культурологов, филологов, искусствоведов и музыкантов.
            Совет формирует стратегию развития музея, утверждает концепции экспозиций, оценивает научную и культурную
            ценность проектов.
          </p>

          <div className="team-member fade-in" style={{maxWidth: '600px', margin: '0 auto 40px'}}>
            <div className="avatar-placeholder">СВ</div>
            <h3>Савчук Валерий Владимирович</h3>
            <p className="role">Заместитель директора по науке АНО</p>
            <p>Доктор философских наук, профессор, директор Центра медиафилософии ИФ СПбГУ</p>
          </div>

          <h3 style={{textAlign: 'center', margin: '40px 0 30px'}}>Члены совета</h3>
          <div className="team-grid">
            <div className="team-member fade-in">
              <div className="avatar-placeholder">МА</div>
              <h3>Малинов Алексей Валерьевич</h3>
              <p className="role">Член совета</p>
              <p>Доктор философских наук, профессор, главный редактор журнала Философский полилог.</p>
            </div>
            <div className="team-member fade-in delay-1">
              <div className="avatar-placeholder">ГА</div>
              <h3>Грякалов Алексей Алексеевич</h3>
              <p className="role">Член совета</p>
              <p>Доктор философских наук, профессор, руководитель Научно-образовательного центра «Философия современности и стратегии гуманитарной экспертизы».</p>
            </div>
            <div className="team-member fade-in delay-2">
              <div className="avatar-placeholder">КД</div>
              <h3>Кузнецов Дмитрий Иванович</h3>
              <p className="role">Член совета</p>
              <p>Доктор философских наук, заведующий кафедрой гуманитарных наук Академического университета им. Ж.И. Алфёрова, профессор СПбПУ, член Союза писателей России.</p>
            </div>
          </div>

          <div className="team-grid" style={{marginTop: '30px'}}>
            <div className="team-member fade-in">
              <div className="avatar-placeholder">ФС</div>
              <h3>Фокин Сергей Леонидович</h3>
              <p className="role">Член совета</p>
              <p>Доктор филологических наук, профессор СПбГЭУ, литературовед и переводчик.</p>
            </div>
            <div className="team-member fade-in delay-1">
              <div className="avatar-placeholder">ХА</div>
              <h3>Хлобыстин Андрей Леонидович</h3>
              <p className="role">Член совета</p>
              <p>Искусствовед, член Союза художников и Союза писателей СПб, эксперт Минкульта РФ.</p>
            </div>
            <div className="team-member fade-in delay-2">
              <div className="avatar-placeholder">ПР</div>
              <h3>Пархоменко Роман Олегович</h3>
              <p className="role">Член совета</p>
              <p>Композитор, дирижёр, член Союза композиторов Татарстана, лауреат международных конкурсов.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Наши партнёры</h2>
          <div className="partners-grid">
            <div className="partner-card fade-in">
              <div className="avatar-placeholder partner-avatar">МГУ</div>
              <h3>МГУ им. М.В. Ломоносова</h3>
              <p>Философский факультет</p>
            </div>
            <div className="partner-card fade-in delay-1">
              <div className="avatar-placeholder partner-avatar">РАН</div>
              <h3>Российская академия наук</h3>
              <p>Институт философии РАН</p>
            </div>
            <div className="partner-card fade-in delay-2">
              <div className="avatar-placeholder partner-avatar">РГБ</div>
              <h3>РГБ</h3>
              <p>Российская государственная библиотека</p>
            </div>
            <div className="partner-card fade-in delay-3">
              <div className="avatar-placeholder partner-avatar">ПКТ</div>
              <h3>Центр «Пунктум»</h3>
              <p>Культурно-просветительский центр</p>
            </div>
            <div className="partner-card fade-in">
              <div className="avatar-placeholder partner-avatar">ЛГС</div>
              <h3>Издательство «Логос»</h3>
              <p>Философская литература</p>
            </div>
            <div className="partner-card fade-in delay-1">
              <div className="avatar-placeholder partner-avatar">GI</div>
              <h3>Гёте-институт</h3>
              <p>Немецкий культурный центр</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;



