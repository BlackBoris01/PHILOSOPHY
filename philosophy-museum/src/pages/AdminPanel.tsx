import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NewsItem, CreateNewsRequest } from '../types/news';
import newsService from '../services/newsService';

const AdminPanel: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showHelp, setShowHelp] = useState(false);
  const [contentImages, setContentImages] = useState<Array<{file: File, url: string, name: string}>>([]);
  const [formData, setFormData] = useState<CreateNewsRequest>({
    title: '',
    subtitle: '',
    content: '',
    excerpt: '',
    date: '',
    readTime: '',
    imageUrl: ''
  });

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsData = await newsService.getAllNews();
        setNews(newsData);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    // Преобразуем дату из формата YYYY-MM-DD в читаемый формат
    const date = new Date(dateValue);
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                   'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const formattedDate = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    
    setFormData(prev => ({
      ...prev,
      date: formattedDate
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Создаем превью изображения
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    // В реальном приложении здесь будет загрузка на сервер
    // Пока возвращаем URL из FileReader
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
    
    try {
      let finalFormData = { ...formData };
      
      // Если есть файл изображения, загружаем его
      if (imageFile) {
        const imageUrl = await uploadImage(imageFile);
        finalFormData.imageUrl = imageUrl;
      }

      if (editingNews) {
        // Обновление существующей новости
        await newsService.updateNews(editingNews.id, finalFormData);
      } else {
        // Создание новой новости
        await newsService.createNews(finalFormData);
      }

      // Сброс формы
      resetForm();
      
      // Перезагружаем список новостей
      const updatedNews = await newsService.getAllNews();
      setNews(updatedNews);
      
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Ошибка при сохранении новости');
    }
  };

  const handleContentImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: Array<{file: File, url: string, name: string}> = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Создаем временный URL для превью
      const previewUrl = URL.createObjectURL(file);
      newImages.push({ 
        file, 
        url: previewUrl,
        name: file.name 
      });
    }
    
    setContentImages([...contentImages, ...newImages]);
  };

  const insertImageSyntax = async (file: File, index: number) => {
    // Показываем индикатор загрузки
    const uploadedUrl = await uploadImage(file);
    
    // Вставляем короткую ссылку вместо base64
    const syntax = `\n\n[img:IMAGE_${Date.now()}_${index}:Описание изображения]\n\n`;
    
    setFormData(prev => ({
      ...prev,
      content: prev.content + syntax
    }));
    
    // В реальном приложении здесь будет загрузка на сервер и получение URL
    // Пока сохраняем base64 в отдельное хранилище
    const imageKey = `IMAGE_${Date.now()}_${index}`;
    localStorage.setItem(`news_image_${imageKey}`, uploadedUrl);
  };

  const removeContentImage = (index: number) => {
    const imageToRemove = contentImages[index];
    // Освобождаем URL объект
    if (imageToRemove && imageToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    setContentImages(contentImages.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    // Освобождаем все временные URL объекты
    contentImages.forEach(img => {
      if (img.url.startsWith('blob:')) {
        URL.revokeObjectURL(img.url);
      }
    });
    
    setFormData({
      title: '',
      subtitle: '',
      content: '',
      excerpt: '',
      date: '',
      readTime: '',
      imageUrl: ''
    });
    setImageFile(null);
    setImagePreview('');
    setContentImages([]);
    setShowForm(false);
    setEditingNews(null);
  };

  const handleEdit = (newsItem: NewsItem) => {
    setFormData({
      title: newsItem.title,
      subtitle: newsItem.subtitle || '',
      content: newsItem.content,
      excerpt: newsItem.excerpt,
      date: newsItem.date,
      readTime: newsItem.readTime,
      imageUrl: newsItem.imageUrl || ''
    });
    if (newsItem.imageUrl) {
      setImagePreview(newsItem.imageUrl);
    }
    setEditingNews(newsItem);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту новость?')) {
      try {
        await newsService.deleteNews(id);
        // Перезагружаем список новостей
        const updatedNews = await newsService.getAllNews();
        setNews(updatedNews);
      } catch (error) {
        console.error('Error deleting news:', error);
        alert('Ошибка при удалении новости');
      }
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  if (loading) {
    return (
      <section className="section page-hero">
        <div className="container">
          <h1 className="page-title">Управление новостями</h1>
          <p className="lead">Загрузка...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <div className="admin-header">
            <div>
              <h1 className="page-title">Управление новостями</h1>
              <p className="lead">Создание и редактирование новостей музея</p>
            </div>
            <Link to="/admin" className="btn btn-secondary">
              ← Назад к панели
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="admin-news-controls">
            <button 
              className="btn btn-primary" 
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? '✕ Закрыть форму' : '+ Добавить новость'}
            </button>
            
            <button 
              className="btn btn-secondary"
              onClick={() => setShowHelp(!showHelp)}
            >
              {showHelp ? '✕ Скрыть помощь' : '? Помощь'}
            </button>
          </div>

          {showHelp && (
            <div className="help-panel">
              <h3>📖 Подсказки по заполнению формы</h3>
              <div className="help-grid">
                <div className="help-item">
                  <strong>Заголовок:</strong>
                  <p>Краткий и привлекательный заголовок новости (рекомендуется до 100 символов)</p>
                </div>
                <div className="help-item">
                  <strong>Подзаголовок:</strong>
                  <p>Дополнительная информация к заголовку (опционально)</p>
                </div>
                <div className="help-item">
                  <strong>Краткое описание:</strong>
                  <p>Анонс новости для списка новостей (2-3 предложения, до 200 символов)</p>
                </div>
                <div className="help-item">
                  <strong>Полный текст:</strong>
                  <p>Используйте HTML-теги для форматирования: &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;blockquote&gt;</p>
                  <p className="help-example">Пример:<br/>&lt;p&gt;Текст абзаца&lt;/p&gt;<br/>&lt;h2&gt;Заголовок раздела&lt;/h2&gt;</p>
                </div>
                <div className="help-item" style={{ background: '#e0f2fe' }}>
                  <strong>🖼️ Вставка изображений в текст:</strong>
                  <p>Используйте специальный синтаксис для вставки изображений прямо в нужное место статьи:</p>
                  <p className="help-example">
                    [img:URL_ИЗОБРАЖЕНИЯ]<br/>
                    или<br/>
                    [img:URL:Подпись к изображению]
                  </p>
                  <p style={{ marginTop: '8px', fontSize: '13px' }}>
                    Пример: [img:https://example.com/photo.jpg:Красивый вид музея]
                  </p>
                </div>
                <div className="help-item">
                  <strong>Дата:</strong>
                  <p>Выберите дату публикации из календаря</p>
                </div>
                <div className="help-item">
                  <strong>Время чтения:</strong>
                  <p>Укажите примерное время чтения (например: "3 мин чтения", "5 мин")</p>
                </div>
                <div className="help-item">
                  <strong>Изображение:</strong>
                  <p>Загрузите изображение в формате JPG, PNG или WEBP (рекомендуемый размер: 1200x630px)</p>
                </div>
              </div>
            </div>
          )}

          {showForm && (
            <div className="admin-form-container">
              <div className="form-header">
                <h2>{editingNews ? '✏️ Редактировать новость' : '➕ Создать новость'}</h2>
                <span className="form-required-note">* — обязательные поля</span>
              </div>
              
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-section">
                  <h3 className="form-section-title">Основная информация</h3>
                  
                  <div className="form-group">
                    <label htmlFor="title">
                      Заголовок *
                      <span className="field-hint">Краткий и привлекательный заголовок</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Например: Открытие новой выставки в музее философии"
                      maxLength={150}
                      required
                    />
                    <span className="char-counter">{formData.title.length}/150</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subtitle">
                      Подзаголовок
                      <span className="field-hint">Дополнительная информация к заголовку</span>
                    </label>
                    <input
                      type="text"
                      id="subtitle"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      placeholder="Например: Приглашаем посетить уникальную экспозицию"
                      maxLength={200}
                    />
                    <span className="char-counter">{formData.subtitle?.length || 0}/200</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="excerpt">
                      Краткое описание *
                      <span className="field-hint">Краткий анонс для списка новостей (2-3 предложения)</span>
                    </label>
                    <textarea
                      id="excerpt"
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Введите краткое описание новости, которое будет отображаться в списке..."
                      maxLength={300}
                      required
                    />
                    <span className="char-counter">{formData.excerpt.length}/300</span>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="form-section-title">Содержание</h3>
                  
                  <div className="form-group">
                    <label htmlFor="content">
                      Полный текст новости *
                      <span className="field-hint">Используйте HTML-теги для форматирования</span>
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={15}
                      placeholder="<p>Первый абзац новости...</p>&#10;&#10;<h2>Заголовок раздела</h2>&#10;<p>Текст раздела...</p>&#10;&#10;<blockquote>Цитата</blockquote>"
                      required
                      className="content-textarea"
                    />
                    <div className="content-tips">
                      <strong>Подсказка:</strong> Используйте теги &lt;p&gt; для абзацев, &lt;h2&gt; и &lt;h3&gt; для заголовков, &lt;blockquote&gt; для цитат
                    </div>
                    <div className="content-tips" style={{ background: '#e0f2fe', borderLeftColor: '#0ea5e9' }}>
                      <strong>🖼️ Вставка изображений:</strong> Чтобы вставить изображение в нужное место текста, используйте:<br/>
                      <code>[img:URL_ИЗОБРАЖЕНИЯ]</code> или <code>[img:URL:Подпись]</code><br/>
                      <small>Пример: [img:https://example.com/photo.jpg:Красивый вид]</small>
                    </div>
                    
                    {/* Дополнительные изображения для статьи */}
                    <div className="content-images-section">
                      <h4 style={{ margin: '20px 0 12px 0', fontSize: '16px', color: 'var(--text)' }}>
                        📸 Изображения для вставки в текст
                      </h4>
                      <p style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '16px' }}>
                        Загрузите изображения и нажмите кнопку "Вставить в текст" для автоматической вставки в нужное место
                      </p>
                      
                      <input
                        type="file"
                        id="content-images"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={handleContentImageChange}
                        className="file-input"
                        multiple
                      />
                      <label htmlFor="content-images" className="file-input-label" style={{ marginBottom: '16px' }}>
                        <span className="file-icon">📁</span>
                        <span>Загрузить изображения для статьи</span>
                      </label>
                      
                      {contentImages.length > 0 && (
                        <div className="content-images-grid">
                          {contentImages.map((img, index) => (
                            <div key={index} className="content-image-item">
                              <img src={img.url} alt={img.name} />
                              <div className="content-image-info">
                                <small>{img.name}</small>
                              </div>
                              <div className="content-image-actions">
                                <button 
                                  type="button"
                                  className="btn btn-small"
                                  onClick={() => insertImageSyntax(img.file, index)}
                                >
                                  ↓ Вставить в текст
                                </button>
                                <button 
                                  type="button"
                                  className="btn btn-small btn-secondary"
                                  onClick={() => removeContentImage(index)}
                                >
                                  ✕ Удалить
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="form-section-title">Метаданные</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="date-picker">
                        Дата публикации *
                        <span className="field-hint">Выберите дату из календаря</span>
                      </label>
                      <input
                        type="date"
                        id="date-picker"
                        onChange={handleDateChange}
                        required
                        className="date-input"
                      />
                      {formData.date && (
                        <div className="date-preview">
                          Отображаемая дата: <strong>{formData.date}</strong>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="readTime">
                        Время чтения *
                        <span className="field-hint">Примерное время на прочтение</span>
                      </label>
                      <input
                        type="text"
                        id="readTime"
                        name="readTime"
                        value={formData.readTime}
                        onChange={handleInputChange}
                        placeholder="3 мин чтения"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="form-section-title">Изображение</h3>
                  
                  <div className="form-group">
                    <label htmlFor="image">
                      Загрузить изображение
                      <span className="field-hint">JPG, PNG или WEBP. Рекомендуемый размер: 1200x630px</span>
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
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary btn-large">
                    {editingNews ? '💾 Сохранить изменения' : '✓ Создать новость'}
                  </button>
                  <button type="button" className="btn btn-secondary btn-large" onClick={handleCancel}>
                    ✕ Отмена
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="admin-news-list">
            <div className="news-list-header">
              <h2>📰 Список новостей ({news.length})</h2>
            </div>
            
            {news.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <p>Новостей пока нет</p>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                  Создать первую новость
                </button>
              </div>
            ) : (
              <div className="news-grid">
                {news.map((item) => (
                  <div key={item.id} className="news-card-admin">
                    {item.imageUrl && (
                      <div className="news-card-admin__image">
                        <img src={item.imageUrl} alt={item.title} />
                      </div>
                    )}
                    <div className="news-card-admin__content">
                      <h3>{item.title}</h3>
                      {item.subtitle && (
                        <p className="news-card-admin__subtitle">{item.subtitle}</p>
                      )}
                      <p className="news-card-admin__meta">
                        📅 {item.date} • ⏱️ {item.readTime}
                      </p>
                      <p className="news-card-admin__excerpt">{item.excerpt}</p>
                    </div>
                    <div className="news-card-admin__actions">
                      <button 
                        className="btn btn-small" 
                        onClick={() => handleEdit(item)}
                        title="Редактировать"
                      >
                        ✏️ Редактировать
                      </button>
                      <button 
                        className="btn btn-small btn-danger" 
                        onClick={() => handleDelete(item.id)}
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
        </div>
      </section>
    </>
  );
};

export default AdminPanel;
