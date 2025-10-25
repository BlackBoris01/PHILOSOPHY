import React, { useState, useEffect } from 'react';
import { NewsItem, CreateNewsRequest } from '../types/news';
import newsService from '../services/newsService';

const AdminPanel: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingNews) {
        // Обновление существующей новости
        const updatedNews = await newsService.updateNews(editingNews.id, formData);
        setNews(news.map(item => 
          item.id === editingNews.id ? updatedNews : item
        ));
      } else {
        // Создание новой новости
        const newNews = await newsService.createNews(formData);
        setNews([newNews, ...news]);
      }

      // Сброс формы
      setFormData({
        title: '',
        subtitle: '',
        content: '',
        excerpt: '',
        date: '',
        readTime: '',
        imageUrl: ''
      });
      setShowForm(false);
      setEditingNews(null);
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Ошибка при сохранении новости');
    }
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
    setEditingNews(newsItem);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту новость?')) {
      try {
        await newsService.deleteNews(id);
        setNews(news.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting news:', error);
        alert('Ошибка при удалении новости');
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      subtitle: '',
      content: '',
      excerpt: '',
      date: '',
      readTime: '',
      imageUrl: ''
    });
    setShowForm(false);
    setEditingNews(null);
  };

  if (loading) {
    return (
      <section className="section page-hero">
        <div className="container">
          <h1 className="page-title">Админ панель</h1>
          <p className="lead">Загрузка...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <h1 className="page-title">Админ панель</h1>
          <p className="lead">Управление новостями музея философии</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="admin-controls">
            <button 
              className="btn" 
              onClick={() => setShowForm(true)}
              disabled={showForm}
            >
              Добавить новость
            </button>
          </div>

          {showForm && (
            <div className="admin-form-container">
              <h2>{editingNews ? 'Редактировать новость' : 'Добавить новость'}</h2>
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                  <label htmlFor="title">Заголовок *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subtitle">Подзаголовок</label>
                  <input
                    type="text"
                    id="subtitle"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="excerpt">Краткое описание *</label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="content">Полный текст *</label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={10}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Дата *</label>
                    <input
                      type="text"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      placeholder="10 июля 2025"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="readTime">Время чтения *</label>
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

                <div className="form-group">
                  <label htmlFor="imageUrl">URL изображения</label>
                  <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn">
                    {editingNews ? 'Обновить' : 'Создать'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="admin-news-list">
            <h2>Список новостей</h2>
            {news.length === 0 ? (
              <p>Новостей пока нет</p>
            ) : (
              <div className="news-list">
                {news.map((item) => (
                  <div key={item.id} className="news-item">
                    <div className="news-item__content">
                      <h3>{item.title}</h3>
                      <p className="news-item__meta">
                        {item.date} • {item.readTime}
                      </p>
                      <p className="news-item__excerpt">{item.excerpt}</p>
                    </div>
                    <div className="news-item__actions">
                      <button 
                        className="btn btn-small" 
                        onClick={() => handleEdit(item)}
                      >
                        Редактировать
                      </button>
                      <button 
                        className="btn btn-small btn-danger" 
                        onClick={() => handleDelete(item.id)}
                      >
                        Удалить
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
