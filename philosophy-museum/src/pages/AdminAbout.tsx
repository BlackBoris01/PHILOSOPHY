import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface AboutPageData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  mission: string;
  vision: string;
  values: string[];
  founders: Array<{
    id: number;
    name: string;
    position: string;
    bio: string;
    image?: string;
  }>;
  leadership: Array<{
    id: number;
    name: string;
    position: string;
    bio: string;
    image?: string;
  }>;
  scientificCouncil: Array<{
    id: number;
    name: string;
    position: string;
    bio: string;
    image?: string;
  }>;
  partners: Array<{
    id: number;
    name: string;
    description: string;
    logo?: string;
    website?: string;
  }>;
}

const AdminAbout: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutPageData>({
    id: 'about-page',
    title: 'О музее',
    subtitle: 'Первая философская институция музейного типа в России',
    description: 'Музей философии — это пространство, где мысль обретает форму, а вопросы оказываются важнее ответов.',
    mission: 'Делаем философию доступной и живой для всех',
    vision: 'Создаем устойчивую площадку для развития философской культуры',
    values: [
      'Открытость и доступность',
      'Интеллектуальная честность',
      'Междисциплинарность',
      'Культурная интеграция'
    ],
    founders: [
      {
        id: 1,
        name: 'Александр Иванов',
        position: 'Основатель и директор',
        bio: 'Философ, культуролог, куратор выставочных проектов'
      }
    ],
    leadership: [
      {
        id: 1,
        name: 'Мария Петрова',
        position: 'Заместитель директора',
        bio: 'Специалист по образовательным программам'
      }
    ],
    scientificCouncil: [
      {
        id: 1,
        name: 'Профессор Сидоров',
        position: 'Председатель научного совета',
        bio: 'Доктор философских наук, профессор СПбГУ'
      }
    ],
    partners: [
      {
        id: 1,
        name: 'СПбГУ',
        description: 'Санкт-Петербургский государственный университет',
        website: 'https://spbu.ru'
      }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    // Загружаем данные из localStorage
    const stored = localStorage.getItem('philosophy_museum_about');
    if (stored) {
      setAboutData(JSON.parse(stored));
    }
  }, []);

  const handleSave = () => {
    setLoading(true);
    try {
      localStorage.setItem('philosophy_museum_about', JSON.stringify(aboutData));
      alert('Данные сохранены успешно!');
    } catch (error) {
      console.error('Error saving about data:', error);
      alert('Ошибка при сохранении данных');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setAboutData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayItemChange = (arrayField: string, index: number, field: string, value: string) => {
    setAboutData(prev => ({
      ...prev,
      [arrayField]: prev[arrayField].map((item: any, i: number) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (arrayField: string, newItem: any) => {
    setAboutData(prev => ({
      ...prev,
      [arrayField]: [...prev[arrayField], newItem]
    }));
  };

  const removeArrayItem = (arrayField: string, index: number) => {
    setAboutData(prev => ({
      ...prev,
      [arrayField]: prev[arrayField].filter((_: any, i: number) => i !== index)
    }));
  };

  const tabs = [
    { id: 'general', label: 'Общая информация' },
    { id: 'mission', label: 'Миссия и ценности' },
    { id: 'founders', label: 'Основатели' },
    { id: 'leadership', label: 'Руководство' },
    { id: 'council', label: 'Научный совет' },
    { id: 'partners', label: 'Партнеры' }
  ];

  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <div className="admin-header">
            <div>
              <h1 className="page-title">Редактирование страницы "О музее"</h1>
              <p className="lead">Управление контентом страницы о музее</p>
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

            {/* Общая информация */}
            {activeTab === 'general' && (
              <div className="form-section">
                <h3 className="form-section-title">Общая информация</h3>
                
                <div className="form-group">
                  <label htmlFor="title">Заголовок страницы</label>
                  <input
                    type="text"
                    id="title"
                    value={aboutData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="О музее"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subtitle">Подзаголовок</label>
                  <input
                    type="text"
                    id="subtitle"
                    value={aboutData.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    placeholder="Первая философская институция музейного типа в России"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Описание</label>
                  <textarea
                    id="description"
                    value={aboutData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    placeholder="Краткое описание музея..."
                  />
                </div>
              </div>
            )}

            {/* Миссия и ценности */}
            {activeTab === 'mission' && (
              <div className="form-section">
                <h3 className="form-section-title">Миссия и ценности</h3>
                
                <div className="form-group">
                  <label htmlFor="mission">Миссия</label>
                  <input
                    type="text"
                    id="mission"
                    value={aboutData.mission}
                    onChange={(e) => handleInputChange('mission', e.target.value)}
                    placeholder="Делаем философию доступной и живой для всех"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="vision">Видение</label>
                  <input
                    type="text"
                    id="vision"
                    value={aboutData.vision}
                    onChange={(e) => handleInputChange('vision', e.target.value)}
                    placeholder="Создаем устойчивую площадку для развития философской культуры"
                  />
                </div>

                <div className="form-group">
                  <label>Ценности</label>
                  {aboutData.values.map((value, index) => (
                    <div key={index} className="form-row">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => {
                          const newValues = [...aboutData.values];
                          newValues[index] = e.target.value;
                          handleInputChange('values', newValues);
                        }}
                        placeholder="Ценность"
                      />
                      <button
                        type="button"
                        className="btn btn-small btn-danger"
                        onClick={() => {
                          const newValues = aboutData.values.filter((_, i) => i !== index);
                          handleInputChange('values', newValues);
                        }}
                      >
                        Удалить
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-small"
                    onClick={() => handleInputChange('values', [...aboutData.values, ''])}
                  >
                    + Добавить ценность
                  </button>
                </div>
              </div>
            )}

            {/* Основатели */}
            {activeTab === 'founders' && (
              <div className="form-section">
                <h3 className="form-section-title">Основатели</h3>
                
                {aboutData.founders.map((founder, index) => (
                  <div key={founder.id} className="form-card">
                    <div className="form-group">
                      <label>Имя</label>
                      <input
                        type="text"
                        value={founder.name}
                        onChange={(e) => handleArrayItemChange('founders', index, 'name', e.target.value)}
                        placeholder="Имя основателя"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Должность</label>
                      <input
                        type="text"
                        value={founder.position}
                        onChange={(e) => handleArrayItemChange('founders', index, 'position', e.target.value)}
                        placeholder="Должность"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Биография</label>
                      <textarea
                        value={founder.bio}
                        onChange={(e) => handleArrayItemChange('founders', index, 'bio', e.target.value)}
                        rows={3}
                        placeholder="Краткая биография"
                      />
                    </div>
                    
                    <button
                      type="button"
                      className="btn btn-small btn-danger"
                      onClick={() => removeArrayItem('founders', index)}
                    >
                      Удалить основателя
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  className="btn btn-small"
                  onClick={() => addArrayItem('founders', {
                    id: Date.now(),
                    name: '',
                    position: '',
                    bio: ''
                  })}
                >
                  + Добавить основателя
                </button>
              </div>
            )}

            {/* Руководство */}
            {activeTab === 'leadership' && (
              <div className="form-section">
                <h3 className="form-section-title">Руководство</h3>
                
                {aboutData.leadership.map((leader, index) => (
                  <div key={leader.id} className="form-card">
                    <div className="form-group">
                      <label>Имя</label>
                      <input
                        type="text"
                        value={leader.name}
                        onChange={(e) => handleArrayItemChange('leadership', index, 'name', e.target.value)}
                        placeholder="Имя руководителя"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Должность</label>
                      <input
                        type="text"
                        value={leader.position}
                        onChange={(e) => handleArrayItemChange('leadership', index, 'position', e.target.value)}
                        placeholder="Должность"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Биография</label>
                      <textarea
                        value={leader.bio}
                        onChange={(e) => handleArrayItemChange('leadership', index, 'bio', e.target.value)}
                        rows={3}
                        placeholder="Краткая биография"
                      />
                    </div>
                    
                    <button
                      type="button"
                      className="btn btn-small btn-danger"
                      onClick={() => removeArrayItem('leadership', index)}
                    >
                      Удалить руководителя
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  className="btn btn-small"
                  onClick={() => addArrayItem('leadership', {
                    id: Date.now(),
                    name: '',
                    position: '',
                    bio: ''
                  })}
                >
                  + Добавить руководителя
                </button>
              </div>
            )}

            {/* Научный совет */}
            {activeTab === 'council' && (
              <div className="form-section">
                <h3 className="form-section-title">Научный совет</h3>
                
                {aboutData.scientificCouncil.map((member, index) => (
                  <div key={member.id} className="form-card">
                    <div className="form-group">
                      <label>Имя</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleArrayItemChange('scientificCouncil', index, 'name', e.target.value)}
                        placeholder="Имя члена совета"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Должность</label>
                      <input
                        type="text"
                        value={member.position}
                        onChange={(e) => handleArrayItemChange('scientificCouncil', index, 'position', e.target.value)}
                        placeholder="Должность"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Биография</label>
                      <textarea
                        value={member.bio}
                        onChange={(e) => handleArrayItemChange('scientificCouncil', index, 'bio', e.target.value)}
                        rows={3}
                        placeholder="Краткая биография"
                      />
                    </div>
                    
                    <button
                      type="button"
                      className="btn btn-small btn-danger"
                      onClick={() => removeArrayItem('scientificCouncil', index)}
                    >
                      Удалить члена совета
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  className="btn btn-small"
                  onClick={() => addArrayItem('scientificCouncil', {
                    id: Date.now(),
                    name: '',
                    position: '',
                    bio: ''
                  })}
                >
                  + Добавить члена совета
                </button>
              </div>
            )}

            {/* Партнеры */}
            {activeTab === 'partners' && (
              <div className="form-section">
                <h3 className="form-section-title">Партнеры</h3>
                
                {aboutData.partners.map((partner, index) => (
                  <div key={partner.id} className="form-card">
                    <div className="form-group">
                      <label>Название</label>
                      <input
                        type="text"
                        value={partner.name}
                        onChange={(e) => handleArrayItemChange('partners', index, 'name', e.target.value)}
                        placeholder="Название партнера"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Описание</label>
                      <textarea
                        value={partner.description}
                        onChange={(e) => handleArrayItemChange('partners', index, 'description', e.target.value)}
                        rows={2}
                        placeholder="Описание партнера"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Сайт</label>
                      <input
                        type="url"
                        value={partner.website || ''}
                        onChange={(e) => handleArrayItemChange('partners', index, 'website', e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                    
                    <button
                      type="button"
                      className="btn btn-small btn-danger"
                      onClick={() => removeArrayItem('partners', index)}
                    >
                      Удалить партнера
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  className="btn btn-small"
                  onClick={() => addArrayItem('partners', {
                    id: Date.now(),
                    name: '',
                    description: '',
                    website: ''
                  })}
                >
                  + Добавить партнера
                </button>
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

export default AdminAbout;
