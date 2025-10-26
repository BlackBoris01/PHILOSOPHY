import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Event {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  type: 'lecture' | 'workshop' | 'discussion' | 'exhibition' | 'conference' | 'other';
  status: 'upcoming' | 'current' | 'past' | 'cancelled';
  capacity?: number;
  price?: number;
  imageUrl?: string;
  featured: boolean;
  tags: string[];
  requirements?: string;
  contactInfo?: string;
}

const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [activeTab, setActiveTab] = useState('list');

  const [formData, setFormData] = useState<Omit<Event, 'id'>>({
    title: '',
    subtitle: '',
    description: '',
    date: '',
    time: '',
    location: '',
    organizer: '',
    type: 'lecture',
    status: 'upcoming',
    capacity: undefined,
    price: undefined,
    imageUrl: '',
    featured: false,
    tags: [],
    requirements: '',
    contactInfo: ''
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const stored = localStorage.getItem('philosophy_museum_events');
    if (stored) {
      setEvents(JSON.parse(stored));
    } else {
      // Начальные данные
      const initialEvents: Event[] = [
        {
          id: 1,
          title: "Философия и современность",
          subtitle: "Публичная лекция",
          description: "Лекция о роли философии в современном мире и её влиянии на общество.",
          date: "2025-11-15",
          time: "19:00",
          location: "Конференц-зал музея",
          organizer: "Доктор Иванов",
          type: 'lecture',
          status: 'upcoming',
          capacity: 50,
          price: 0,
          featured: true,
          tags: ["философия", "лекция", "современность"],
          requirements: "Регистрация обязательна",
          contactInfo: "events@philosophy-museum.ru"
        },
        {
          id: 2,
          title: "Мастер-класс по логике",
          subtitle: "Практическое занятие",
          description: "Интерактивный мастер-класс по основам логического мышления.",
          date: "2025-11-20",
          time: "18:30",
          location: "Учебный класс",
          organizer: "Профессор Петрова",
          type: 'workshop',
          status: 'upcoming',
          capacity: 20,
          price: 500,
          featured: false,
          tags: ["логика", "мастер-класс", "образование"],
          requirements: "Базовые знания не требуются",
          contactInfo: "workshop@philosophy-museum.ru"
        }
      ];
      setEvents(initialEvents);
      localStorage.setItem('philosophy_museum_events', JSON.stringify(initialEvents));
    }
  };

  const saveEvents = (updatedEvents: Event[]) => {
    localStorage.setItem('philosophy_museum_events', JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      const numValue = value === '' ? undefined : Number(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalFormData = { ...formData };
      
      if (imageFile) {
        const imageUrl = await uploadImage(imageFile);
        finalFormData.imageUrl = imageUrl;
      }

      const updatedEvents = editingEvent 
        ? events.map(evt => evt.id === editingEvent.id ? { ...finalFormData, id: editingEvent.id } : evt)
        : [...events, { ...finalFormData, id: Date.now() }];

      saveEvents(updatedEvents);
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Ошибка при сохранении мероприятия');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: Event) => {
    setFormData({
      title: event.title,
      subtitle: event.subtitle || '',
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      organizer: event.organizer,
      type: event.type,
      status: event.status,
      capacity: event.capacity,
      price: event.price,
      imageUrl: event.imageUrl || '',
      featured: event.featured,
      tags: [...event.tags],
      requirements: event.requirements || '',
      contactInfo: event.contactInfo || ''
    });
    if (event.imageUrl) {
      setImagePreview(event.imageUrl);
    }
    setEditingEvent(event);
    setShowForm(true);
    setActiveTab('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить это мероприятие?')) {
      const updatedEvents = events.filter(evt => evt.id !== id);
      saveEvents(updatedEvents);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      date: '',
      time: '',
      location: '',
      organizer: '',
      type: 'lecture',
      status: 'upcoming',
      capacity: undefined,
      price: undefined,
      imageUrl: '',
      featured: false,
      tags: [],
      requirements: '',
      contactInfo: ''
    });
    setImageFile(null);
    setImagePreview('');
    setShowForm(false);
    setEditingEvent(null);
  };

  const handleCancel = () => {
    resetForm();
    setActiveTab('list');
  };

  const addTag = () => {
    const tag = prompt('Введите тег:');
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'lecture': return 'Лекция';
      case 'workshop': return 'Мастер-класс';
      case 'discussion': return 'Дискуссия';
      case 'exhibition': return 'Выставка';
      case 'conference': return 'Конференция';
      case 'other': return 'Другое';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Предстоящее';
      case 'current': return 'Текущее';
      case 'past': return 'Завершенное';
      case 'cancelled': return 'Отменено';
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'upcoming': return 'status-upcoming';
      case 'current': return 'status-current';
      case 'past': return 'status-past';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const tabs = [
    { id: 'list', label: 'Список мероприятий' },
    { id: 'form', label: editingEvent ? 'Редактировать мероприятие' : 'Добавить мероприятие' }
  ];

  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <div className="admin-header">
            <div>
              <h1 className="page-title">Управление мероприятиями</h1>
              <p className="lead">Создание и редактирование событий музея</p>
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
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'list') {
                      resetForm();
                    }
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Список мероприятий */}
            {activeTab === 'list' && (
              <div className="admin-list">
                <div className="admin-list-header">
                  <h2>📅 Мероприятия ({events.length})</h2>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setActiveTab('form');
                      setShowForm(true);
                    }}
                  >
                    + Добавить мероприятие
                  </button>
                </div>
                
                {events.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>Мероприятий пока нет</p>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => {
                        setActiveTab('form');
                        setShowForm(true);
                      }}
                    >
                      Создать первое мероприятие
                    </button>
                  </div>
                ) : (
                  <div className="events-grid">
                    {events.map((event) => (
                      <div key={event.id} className="event-card-admin">
                        {event.imageUrl && (
                          <div className="event-card-admin__image">
                            <img src={event.imageUrl} alt={event.title} />
                          </div>
                        )}
                        <div className="event-card-admin__content">
                          <div className="event-card-admin__header">
                            <h3>{event.title}</h3>
                            <div className="event-card-admin__badges">
                              <span className={`status-badge ${getStatusClass(event.status)}`}>
                                {getStatusLabel(event.status)}
                              </span>
                              <span className="type-badge">
                                {getTypeLabel(event.type)}
                              </span>
                            </div>
                          </div>
                          {event.subtitle && (
                            <p className="event-card-admin__subtitle">{event.subtitle}</p>
                          )}
                          <p className="event-card-admin__meta">
                            📅 {event.date} в {event.time}
                          </p>
                          <p className="event-card-admin__meta">
                            📍 {event.location}
                          </p>
                          <p className="event-card-admin__meta">
                            👤 Организатор: {event.organizer}
                          </p>
                          {event.capacity && (
                            <p className="event-card-admin__meta">
                              👥 Мест: {event.capacity}
                            </p>
                          )}
                          {event.price !== undefined && (
                            <p className="event-card-admin__meta">
                              💰 Цена: {event.price === 0 ? 'Бесплатно' : `${event.price} ₽`}
                            </p>
                          )}
                          <p className="event-card-admin__description">{event.description}</p>
                          {event.tags.length > 0 && (
                            <div className="event-card-admin__tags">
                              {event.tags.map((tag, index) => (
                                <span key={index} className="tag">{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="event-card-admin__actions">
                          <button 
                            className="btn btn-small" 
                            onClick={() => handleEdit(event)}
                            title="Редактировать"
                          >
                            ✏️ Редактировать
                          </button>
                          <button 
                            className="btn btn-small btn-danger" 
                            onClick={() => handleDelete(event.id)}
                            title="Удалить"
                          >
                            🗑️ Удалить
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Форма мероприятия */}
            {activeTab === 'form' && (
              <div className="admin-form">
                <div className="form-header">
                  <h2>{editingEvent ? '✏️ Редактировать мероприятие' : '➕ Создать мероприятие'}</h2>
                  <span className="form-required-note">* — обязательные поля</span>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="form-section">
                    <h3 className="form-section-title">Основная информация</h3>
                    
                    <div className="form-group">
                      <label htmlFor="title">
                        Название мероприятия *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Название мероприятия"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="subtitle">
                        Подзаголовок
                      </label>
                      <input
                        type="text"
                        id="subtitle"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleInputChange}
                        placeholder="Краткое описание"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="description">
                        Описание *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Подробное описание мероприятия"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="type">
                        Тип мероприятия *
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="lecture">Лекция</option>
                        <option value="workshop">Мастер-класс</option>
                        <option value="discussion">Дискуссия</option>
                        <option value="exhibition">Выставка</option>
                        <option value="conference">Конференция</option>
                        <option value="other">Другое</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3 className="form-section-title">Дата, время и место</h3>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="date">
                          Дата *
                        </label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="time">
                          Время *
                        </label>
                        <input
                          type="time"
                          id="time"
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="location">
                        Место проведения *
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Зал музея"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="organizer">
                        Организатор *
                      </label>
                      <input
                        type="text"
                        id="organizer"
                        name="organizer"
                        value={formData.organizer}
                        onChange={handleInputChange}
                        placeholder="Имя организатора"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="status">
                        Статус *
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="upcoming">Предстоящее</option>
                        <option value="current">Текущее</option>
                        <option value="past">Завершенное</option>
                        <option value="cancelled">Отменено</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3 className="form-section-title">Дополнительная информация</h3>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="capacity">
                          Количество мест
                        </label>
                        <input
                          type="number"
                          id="capacity"
                          name="capacity"
                          value={formData.capacity || ''}
                          onChange={handleInputChange}
                          placeholder="50"
                          min="1"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="price">
                          Цена (₽)
                        </label>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={formData.price || ''}
                          onChange={handleInputChange}
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="requirements">
                        Требования
                      </label>
                      <textarea
                        id="requirements"
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="Особые требования к участникам"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="contactInfo">
                        Контактная информация
                      </label>
                      <input
                        type="text"
                        id="contactInfo"
                        name="contactInfo"
                        value={formData.contactInfo}
                        onChange={handleInputChange}
                        placeholder="email@example.com или телефон"
                      />
                    </div>
                  </div>

                  <div className="form-section">
                    <h3 className="form-section-title">Теги</h3>
                    
                    <div className="form-group">
                      <label>Теги</label>
                      <div className="tags-container">
                        {formData.tags.map((tag, index) => (
                          <span key={index} className="tag">
                            {tag}
                            <button
                              type="button"
                              className="tag-remove"
                              onClick={() => removeTag(index)}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="btn btn-small"
                        onClick={addTag}
                      >
                        + Добавить тег
                      </button>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3 className="form-section-title">Изображение</h3>
                    
                    <div className="form-group">
                      <label htmlFor="image">
                        Загрузить изображение
                      </label>
                      <div className="image-upload-container">
                        <input
                          type="file"
                          id="image"
                          accept="image/jpeg,image/png,image/webp,image/jpg"
                          onChange={handleImageChange}
                          className="file-input"
                        />
                        <label htmlFor="image" className="file-input-label">
                          <span className="file-icon">📁</span>
                          <span>{imageFile ? imageFile.name : 'Выберите файл'}</span>
                        </label>
                      </div>
                      
                      {imagePreview && (
                        <div className="image-preview-container">
                          <p className="preview-label">Превью изображения:</p>
                          <img src={imagePreview} alt="Preview" className="image-preview" />
                          <button 
                            type="button" 
                            className="btn btn-small btn-secondary"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview('');
                            }}
                          >
                            Удалить изображение
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                        />
                        <span className="checkbox-custom"></span>
                        Рекомендуемое мероприятие
                      </label>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-large"
                      disabled={loading}
                    >
                      {loading ? 'Сохранение...' : (editingEvent ? '💾 Сохранить изменения' : '✓ Создать мероприятие')}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-large" 
                      onClick={handleCancel}
                    >
                      ✕ Отмена
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminEvents;
