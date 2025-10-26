import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface HomePageData {
  id: string;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    imageUrl?: string;
  };
  mission: {
    title: string;
    description: string;
    facts: Array<{
      id: number;
      icon: string;
      title: string;
      description: string;
    }>;
  };
  eventsPreview: {
    title: string;
    buttonText: string;
    buttonLink: string;
    showCount: number;
    showFeaturedOnly: boolean;
  };
  news: {
    title: string;
    showCount: number;
    showFeaturedOnly: boolean;
  };
  social: {
    title: string;
    description: string;
    links: Array<{
      id: number;
      icon: string;
      name: string;
      description: string;
      url: string;
    }>;
  };
}

const AdminHome: React.FC = () => {
  const [homeData, setHomeData] = useState<HomePageData>({
    id: 'home-page',
    hero: {
      eyebrow: 'Первая философская институция музейного типа',
      title: 'Маршрут к бытию построен',
      description: 'Музей философии — это пространство, где мысль обретает форму, а вопросы оказываются важнее ответов. Мы стремимся сделать философию доступной и живой, показать её как часть культуры и повседневности.',
      buttonText: 'Узнать больше',
      buttonLink: '/about'
    },
    mission: {
      title: 'Наша миссия',
      description: 'Создание новой культурной институции, где философия становится доступной, понятной и живой частью общественной жизни.',
      facts: [
        {
          id: 1,
          icon: '💭',
          title: 'Философия как диалог',
          description: 'Создаём площадку для общения философов, студентов, школьников и широкой аудитории.'
        },
        {
          id: 2,
          icon: '🎯',
          title: 'Философия как практика',
          description: 'Лекции, дискуссии, квесты и мультимедийные проекты позволяют проживать философские идеи.'
        },
        {
          id: 3,
          icon: '🌉',
          title: 'Философия как культурный мост',
          description: 'Соединяем русскую философскую традицию с современными гуманитарными технологиями.'
        },
        {
          id: 4,
          icon: '🏛️',
          title: 'Философия как память',
          description: 'Увековечиваем имена мыслителей через таблички, маршруты и мультимедийные проекты.'
        }
      ]
    },
    eventsPreview: {
      title: 'Анонсы событий',
      buttonText: 'Все мероприятия',
      buttonLink: '/events',
      showCount: 3,
      showFeaturedOnly: false
    },
    news: {
      title: 'Последние новости',
      showCount: 3,
      showFeaturedOnly: false
    },
    social: {
      title: 'Следите за нами',
      description: 'Присоединяйтесь к нашему сообществу в социальных сетях',
      links: [
        {
          id: 1,
          icon: '📘',
          name: 'ВКонтакте',
          description: 'Новости и обсуждения',
          url: 'https://vk.com/philosophical_museum'
        },
        {
          id: 2,
          icon: '💬',
          name: 'Telegram',
          description: 'Новости и обсуждения',
          url: 'https://t.me/MuseumofPhilosophy'
        },
        {
          id: 3,
          icon: '📰',
          name: 'Яндекс Дзен',
          description: 'Философский маршрут',
          url: 'https://dzen.ru/filosofskiy_marshrut'
        }
      ]
    }
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = () => {
    const stored = localStorage.getItem('philosophy_museum_home');
    if (stored) {
      setHomeData(JSON.parse(stored));
    }
  };

  const saveHomeData = (updatedData: HomePageData) => {
    localStorage.setItem('philosophy_museum_home', JSON.stringify(updatedData));
    setHomeData(updatedData);
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setHomeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof HomePageData],
        [field]: value
      }
    }));
  };


  const handleSave = () => {
    setLoading(true);
    try {
      saveHomeData(homeData);
      alert('Данные сохранены успешно!');
    } catch (error) {
      console.error('Error saving home data:', error);
      alert('Ошибка при сохранении данных');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'hero', label: 'Hero секция' },
    { id: 'mission', label: 'Миссия' },
    { id: 'news', label: 'Новости' },
    { id: 'events', label: 'Анонсы событий' },
    { id: 'social', label: 'Социальные сети' }
  ];

  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <div className="admin-header">
            <div>
              <h1 className="page-title">Управление главной страницей</h1>
              <p className="lead">Редактирование контента главной страницы</p>
            </div>
            <Link to="/admin" className="btn btn-secondary">
              ← Назад к панели
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="admin-form-container">
            {/* Табы */}
            <div className="admin-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Hero секция */}
            {activeTab === 'hero' && (
              <div className="form-section">
                <h3 className="form-section-title">Hero секция</h3>
                
                <div className="form-group">
                  <label htmlFor="hero-eyebrow">
                    Надзаголовок
                  </label>
                  <input
                    type="text"
                    id="hero-eyebrow"
                    value={homeData.hero.eyebrow}
                    onChange={(e) => handleInputChange('hero', 'eyebrow', e.target.value)}
                    placeholder="Первая философская институция музейного типа"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="hero-title">
                    Главный заголовок
                  </label>
                  <input
                    type="text"
                    id="hero-title"
                    value={homeData.hero.title}
                    onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
                    placeholder="Маршрут к бытию построен"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="hero-description">
                    Описание
                  </label>
                  <textarea
                    id="hero-description"
                    value={homeData.hero.description}
                    onChange={(e) => handleInputChange('hero', 'description', e.target.value)}
                    rows={4}
                    placeholder="Описание музея..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="hero-button-text">
                      Текст кнопки
                    </label>
                    <input
                      type="text"
                      id="hero-button-text"
                      value={homeData.hero.buttonText}
                      onChange={(e) => handleInputChange('hero', 'buttonText', e.target.value)}
                      placeholder="Узнать больше"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="hero-button-link">
                      Ссылка кнопки
                    </label>
                    <input
                      type="text"
                      id="hero-button-link"
                      value={homeData.hero.buttonLink}
                      onChange={(e) => handleInputChange('hero', 'buttonLink', e.target.value)}
                      placeholder="/about"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Миссия */}
            {activeTab === 'mission' && (
              <div className="form-section">
                <h3 className="form-section-title">Секция "Наша миссия"</h3>
                
                <div className="form-group">
                  <label htmlFor="mission-title">
                    Заголовок секции
                  </label>
                  <input
                    type="text"
                    id="mission-title"
                    value={homeData.mission.title}
                    onChange={(e) => handleInputChange('mission', 'title', e.target.value)}
                    placeholder="Наша миссия"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mission-description">
                    Описание миссии
                  </label>
                  <textarea
                    id="mission-description"
                    value={homeData.mission.description}
                    onChange={(e) => handleInputChange('mission', 'description', e.target.value)}
                    rows={3}
                    placeholder="Описание миссии музея..."
                  />
                </div>

                <div className="form-group">
                  <label>Карточки фактов</label>
                  {homeData.mission.facts.map((fact, index) => (
                    <div key={fact.id} className="form-card">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Иконка</label>
                          <input
                            type="text"
                            value={fact.icon}
                            onChange={(e) => {
                              const newFacts = [...homeData.mission.facts];
                              newFacts[index] = { ...fact, icon: e.target.value };
                              handleInputChange('mission', 'facts', newFacts);
                            }}
                            placeholder="💭"
                          />
                        </div>
                        <div className="form-group">
                          <label>Заголовок</label>
                          <input
                            type="text"
                            value={fact.title}
                            onChange={(e) => {
                              const newFacts = [...homeData.mission.facts];
                              newFacts[index] = { ...fact, title: e.target.value };
                              handleInputChange('mission', 'facts', newFacts);
                            }}
                            placeholder="Философия как диалог"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Описание</label>
                        <textarea
                          value={fact.description}
                          onChange={(e) => {
                            const newFacts = [...homeData.mission.facts];
                            newFacts[index] = { ...fact, description: e.target.value };
                            handleInputChange('mission', 'facts', newFacts);
                          }}
                          rows={2}
                          placeholder="Описание факта..."
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-small btn-danger"
                        onClick={() => {
                          const newFacts = homeData.mission.facts.filter((_, i) => i !== index);
                          handleInputChange('mission', 'facts', newFacts);
                        }}
                      >
                        Удалить карточку
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-small"
                    onClick={() => {
                      const newFact = {
                        id: Date.now(),
                        icon: '🎯',
                        title: 'Новый факт',
                        description: 'Описание нового факта'
                      };
                      handleInputChange('mission', 'facts', [...homeData.mission.facts, newFact]);
                    }}
                  >
                    + Добавить карточку
                  </button>
                </div>
              </div>
            )}

            {/* Новости */}
            {activeTab === 'news' && (
              <div className="form-section">
                <h3 className="form-section-title">Секция "Последние новости"</h3>
                
                <div className="form-group">
                  <label htmlFor="news-title">
                    Заголовок секции
                  </label>
                  <input
                    type="text"
                    id="news-title"
                    value={homeData.news.title}
                    onChange={(e) => handleInputChange('news', 'title', e.target.value)}
                    placeholder="Последние новости"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="news-show-count">
                      Количество новостей
                    </label>
                    <input
                      type="number"
                      id="news-show-count"
                      value={homeData.news.showCount}
                      onChange={(e) => handleInputChange('news', 'showCount', parseInt(e.target.value))}
                      min="1"
                      max="10"
                      placeholder="3"
                    />
                    <span className="field-hint">Сколько новостей показывать на главной (1-10)</span>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={homeData.news.showFeaturedOnly}
                        onChange={(e) => handleInputChange('news', 'showFeaturedOnly', e.target.checked)}
                      />
                      <span className="checkbox-custom"></span>
                      Показывать только рекомендуемые новости
                    </label>
                    <span className="field-hint">Если включено, будут показаны только новости с флагом "Рекомендуемая"</span>
                  </div>
                </div>

                <div className="help-panel" style={{ marginTop: '20px' }}>
                  <h4>ℹ️ Как это работает:</h4>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    <li>Новости автоматически подтягиваются из раздела "Управление новостями"</li>
                    <li>Отображаются последние новости по дате создания</li>
                    <li>Если включен фильтр "Рекомендуемые", показываются только новости с соответствующим флагом</li>
                    <li>Новости отображаются в том же порядке, что и в списке новостей</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Анонсы событий */}
            {activeTab === 'events' && (
              <div className="form-section">
                <h3 className="form-section-title">Секция "Анонсы событий"</h3>
                
                <div className="form-group">
                  <label htmlFor="events-title">
                    Заголовок секции
                  </label>
                  <input
                    type="text"
                    id="events-title"
                    value={homeData.eventsPreview.title}
                    onChange={(e) => handleInputChange('eventsPreview', 'title', e.target.value)}
                    placeholder="Анонсы событий"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="events-button-text">
                      Текст кнопки
                    </label>
                    <input
                      type="text"
                      id="events-button-text"
                      value={homeData.eventsPreview.buttonText}
                      onChange={(e) => handleInputChange('eventsPreview', 'buttonText', e.target.value)}
                      placeholder="Все мероприятия"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="events-button-link">
                      Ссылка кнопки
                    </label>
                    <input
                      type="text"
                      id="events-button-link"
                      value={homeData.eventsPreview.buttonLink}
                      onChange={(e) => handleInputChange('eventsPreview', 'buttonLink', e.target.value)}
                      placeholder="/events"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="events-show-count">
                      Количество событий
                    </label>
                    <input
                      type="number"
                      id="events-show-count"
                      value={homeData.eventsPreview.showCount}
                      onChange={(e) => handleInputChange('eventsPreview', 'showCount', parseInt(e.target.value))}
                      min="1"
                      max="10"
                      placeholder="3"
                    />
                    <span className="field-hint">Сколько событий показывать на главной (1-10)</span>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={homeData.eventsPreview.showFeaturedOnly}
                        onChange={(e) => handleInputChange('eventsPreview', 'showFeaturedOnly', e.target.checked)}
                      />
                      <span className="checkbox-custom"></span>
                      Показывать только рекомендуемые события
                    </label>
                    <span className="field-hint">Если включено, будут показаны только события с флагом "Рекомендуемое"</span>
                  </div>
                </div>

                <div className="help-panel" style={{ marginTop: '20px' }}>
                  <h4>ℹ️ Как это работает:</h4>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    <li>События автоматически подтягиваются из раздела "Управление мероприятиями"</li>
                    <li>Отображаются предстоящие события по дате проведения</li>
                    <li>Если включен фильтр "Рекомендуемые", показываются только события с соответствующим флагом</li>
                    <li>События отображаются в хронологическом порядке</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Социальные сети */}
            {activeTab === 'social' && (
              <div className="form-section">
                <h3 className="form-section-title">Секция "Социальные сети"</h3>
                
                <div className="form-group">
                  <label htmlFor="social-title">
                    Заголовок секции
                  </label>
                  <input
                    type="text"
                    id="social-title"
                    value={homeData.social.title}
                    onChange={(e) => handleInputChange('social', 'title', e.target.value)}
                    placeholder="Следите за нами"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="social-description">
                    Описание секции
                  </label>
                  <textarea
                    id="social-description"
                    value={homeData.social.description}
                    onChange={(e) => handleInputChange('social', 'description', e.target.value)}
                    rows={2}
                    placeholder="Присоединяйтесь к нашему сообществу..."
                  />
                </div>

                <div className="form-group">
                  <label>Социальные сети</label>
                  {homeData.social.links.map((link, index) => (
                    <div key={link.id} className="form-card">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Иконка</label>
                          <input
                            type="text"
                            value={link.icon}
                            onChange={(e) => {
                              const newLinks = [...homeData.social.links];
                              newLinks[index] = { ...link, icon: e.target.value };
                              handleInputChange('social', 'links', newLinks);
                            }}
                            placeholder="📘"
                          />
                        </div>
                        <div className="form-group">
                          <label>Название</label>
                          <input
                            type="text"
                            value={link.name}
                            onChange={(e) => {
                              const newLinks = [...homeData.social.links];
                              newLinks[index] = { ...link, name: e.target.value };
                              handleInputChange('social', 'links', newLinks);
                            }}
                            placeholder="ВКонтакте"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Описание</label>
                        <input
                          type="text"
                          value={link.description}
                          onChange={(e) => {
                            const newLinks = [...homeData.social.links];
                            newLinks[index] = { ...link, description: e.target.value };
                            handleInputChange('social', 'links', newLinks);
                          }}
                          placeholder="Новости и обсуждения"
                        />
                      </div>
                      <div className="form-group">
                        <label>URL</label>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => {
                            const newLinks = [...homeData.social.links];
                            newLinks[index] = { ...link, url: e.target.value };
                            handleInputChange('social', 'links', newLinks);
                          }}
                          placeholder="https://vk.com/philosophical_museum"
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-small btn-danger"
                        onClick={() => {
                          const newLinks = homeData.social.links.filter((_, i) => i !== index);
                          handleInputChange('social', 'links', newLinks);
                        }}
                      >
                        Удалить ссылку
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-small"
                    onClick={() => {
                      const newLink = {
                        id: Date.now(),
                        icon: '🔗',
                        name: 'Новая сеть',
                        description: 'Описание',
                        url: 'https://example.com'
                      };
                      handleInputChange('social', 'links', [...homeData.social.links, newLink]);
                    }}
                  >
                    + Добавить ссылку
                  </button>
                </div>
              </div>
            )}

            {/* Кнопки действий */}
            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-primary btn-large"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Сохранение...' : '💾 Сохранить изменения'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminHome;
