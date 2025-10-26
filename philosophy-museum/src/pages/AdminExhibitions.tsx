import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Exhibition {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  curator: string;
  status: 'upcoming' | 'current' | 'past';
  imageUrl?: string;
  featured: boolean;
  categories: string[];
  tags: string[];
}

const AdminExhibitions: React.FC = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingExhibition, setEditingExhibition] = useState<Exhibition | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [activeTab, setActiveTab] = useState('list');

  const [formData, setFormData] = useState<Omit<Exhibition, 'id'>>({
    title: '',
    subtitle: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    curator: '',
    status: 'upcoming',
    imageUrl: '',
    featured: false,
    categories: [],
    tags: []
  });

  useEffect(() => {
    loadExhibitions();
  }, []);

  const loadExhibitions = () => {
    const stored = localStorage.getItem('philosophy_museum_exhibitions');
    if (stored) {
      setExhibitions(JSON.parse(stored));
    } else {
      // Начальные данные
      const initialExhibitions: Exhibition[] = [
        {
          id: 1,
          title: "Философия и искусство",
          subtitle: "Диалог между мыслью и формой",
          description: "Выставка исследует взаимосвязь между философскими концепциями и художественными практиками.",
          startDate: "2025-11-01",
          endDate: "2025-12-31",
          location: "Главный зал музея",
          curator: "Анна Петрова",
          status: 'upcoming',
          featured: true,
          categories: ["Философия", "Искусство"],
          tags: ["современное искусство", "философия", "выставка"]
        },
        {
          id: 2,
          title: "История русской философии",
          subtitle: "От Соловьева до наших дней",
          description: "Ретроспективная выставка, посвященная развитию русской философской мысли.",
          startDate: "2025-10-15",
          endDate: "2025-11-30",
          location: "Зал истории",
          curator: "Иван Сидоров",
          status: 'current',
          featured: false,
          categories: ["История", "Философия"],
          tags: ["русская философия", "история", "ретроспектива"]
        }
      ];
      setExhibitions(initialExhibitions);
      localStorage.setItem('philosophy_museum_exhibitions', JSON.stringify(initialExhibitions));
    }
  };

  const saveExhibitions = (updatedExhibitions: Exhibition[]) => {
    localStorage.setItem('philosophy_museum_exhibitions', JSON.stringify(updatedExhibitions));
    setExhibitions(updatedExhibitions);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
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

      const updatedExhibitions = editingExhibition 
        ? exhibitions.map(exh => exh.id === editingExhibition.id ? { ...finalFormData, id: editingExhibition.id } : exh)
        : [...exhibitions, { ...finalFormData, id: Date.now() }];

      saveExhibitions(updatedExhibitions);
      resetForm();
    } catch (error) {
      console.error('Error saving exhibition:', error);
      alert('Ошибка при сохранении экспозиции');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exhibition: Exhibition) => {
    setFormData({
      title: exhibition.title,
      subtitle: exhibition.subtitle || '',
      description: exhibition.description,
      startDate: exhibition.startDate,
      endDate: exhibition.endDate,
      location: exhibition.location,
      curator: exhibition.curator,
      status: exhibition.status,
      imageUrl: exhibition.imageUrl || '',
      featured: exhibition.featured,
      categories: [...exhibition.categories],
      tags: [...exhibition.tags]
    });
    if (exhibition.imageUrl) {
      setImagePreview(exhibition.imageUrl);
    }
    setEditingExhibition(exhibition);
    setShowForm(true);
    setActiveTab('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту экспозицию?')) {
      const updatedExhibitions = exhibitions.filter(exh => exh.id !== id);
      saveExhibitions(updatedExhibitions);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
      curator: '',
      status: 'upcoming',
      imageUrl: '',
      featured: false,
      categories: [],
      tags: []
    });
    setImageFile(null);
    setImagePreview('');
    setShowForm(false);
    setEditingExhibition(null);
  };

  const handleCancel = () => {
    resetForm();
    setActiveTab('list');
  };

  const addCategory = () => {
    const category = prompt('Введите название категории:');
    if (category && !formData.categories.includes(category)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, category]
      }));
    }
  };

  const removeCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Предстоящая';
      case 'current': return 'Текущая';
      case 'past': return 'Завершенная';
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'upcoming': return 'status-upcoming';
      case 'current': return 'status-current';
      case 'past': return 'status-past';
      default: return '';
    }
  };

  const tabs = [
    { id: 'list', label: 'Список экспозиций' },
    { id: 'form', label: editingExhibition ? 'Редактировать экспозицию' : 'Добавить экспозицию' }
  ];

  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <div className="admin-header">
            <div>
              <h1 className="page-title">Управление экспозициями</h1>
              <p className="lead">Создание и редактирование выставок музея</p>
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

            {/* Список экспозиций */}
            {activeTab === 'list' && (
              <div className="admin-list">
                <div className="admin-list-header">
                  <h2>📚 Экспозиции ({exhibitions.length})</h2>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setActiveTab('form');
                      setShowForm(true);
                    }}
                  >
                    + Добавить экспозицию
                  </button>
                </div>
                
                {exhibitions.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>Экспозиций пока нет</p>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => {
                        setActiveTab('form');
                        setShowForm(true);
                      }}
                    >
                      Создать первую экспозицию
                    </button>
                  </div>
                ) : (
                  <div className="exhibitions-grid">
                    {exhibitions.map((exhibition) => (
                      <div key={exhibition.id} className="exhibition-card-admin">
                        {exhibition.imageUrl && (
                          <div className="exhibition-card-admin__image">
                            <img src={exhibition.imageUrl} alt={exhibition.title} />
                          </div>
                        )}
                        <div className="exhibition-card-admin__content">
                          <div className="exhibition-card-admin__header">
                            <h3>{exhibition.title}</h3>
                            <span className={`status-badge ${getStatusClass(exhibition.status)}`}>
                              {getStatusLabel(exhibition.status)}
                            </span>
                          </div>
                          {exhibition.subtitle && (
                            <p className="exhibition-card-admin__subtitle">{exhibition.subtitle}</p>
                          )}
                          <p className="exhibition-card-admin__meta">
                            📅 {exhibition.startDate} - {exhibition.endDate}
                          </p>
                          <p className="exhibition-card-admin__meta">
                            📍 {exhibition.location}
                          </p>
                          <p className="exhibition-card-admin__meta">
                            👤 Куратор: {exhibition.curator}
                          </p>
                          <p className="exhibition-card-admin__description">{exhibition.description}</p>
                          {exhibition.categories.length > 0 && (
                            <div className="exhibition-card-admin__categories">
                              {exhibition.categories.map((category, index) => (
                                <span key={index} className="category-tag">{category}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="exhibition-card-admin__actions">
                          <button 
                            className="btn btn-small" 
                            onClick={() => handleEdit(exhibition)}
                            title="Редактировать"
                          >
                            ✏️ Редактировать
                          </button>
                          <button 
                            className="btn btn-small btn-danger" 
                            onClick={() => handleDelete(exhibition.id)}
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

            {/* Форма экспозиции */}
            {activeTab === 'form' && (
              <div className="admin-form">
                <div className="form-header">
                  <h2>{editingExhibition ? '✏️ Редактировать экспозицию' : '➕ Создать экспозицию'}</h2>
                  <span className="form-required-note">* — обязательные поля</span>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="form-section">
                    <h3 className="form-section-title">Основная информация</h3>
                    
                    <div className="form-group">
                      <label htmlFor="title">
                        Название экспозиции *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Название экспозиции"
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
                        placeholder="Подробное описание экспозиции"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-section">
                    <h3 className="form-section-title">Даты и место</h3>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="startDate">
                          Дата начала *
                        </label>
                        <input
                          type="date"
                          id="startDate"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="endDate">
                          Дата окончания *
                        </label>
                        <input
                          type="date"
                          id="endDate"
                          name="endDate"
                          value={formData.endDate}
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
                      <label htmlFor="curator">
                        Куратор *
                      </label>
                      <input
                        type="text"
                        id="curator"
                        name="curator"
                        value={formData.curator}
                        onChange={handleInputChange}
                        placeholder="Имя куратора"
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
                        <option value="upcoming">Предстоящая</option>
                        <option value="current">Текущая</option>
                        <option value="past">Завершенная</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3 className="form-section-title">Категории и теги</h3>
                    
                    <div className="form-group">
                      <label>Категории</label>
                      <div className="tags-container">
                        {formData.categories.map((category, index) => (
                          <span key={index} className="tag">
                            {category}
                            <button
                              type="button"
                              className="tag-remove"
                              onClick={() => removeCategory(index)}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="btn btn-small"
                        onClick={addCategory}
                      >
                        + Добавить категорию
                      </button>
                    </div>

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
                        Рекомендуемая экспозиция
                      </label>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-large"
                      disabled={loading}
                    >
                      {loading ? 'Сохранение...' : (editingExhibition ? '💾 Сохранить изменения' : '✓ Создать экспозицию')}
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

export default AdminExhibitions;
