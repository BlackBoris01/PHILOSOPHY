import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NewsItem } from '../types/news';
import newsService from '../services/newsService';

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  const formatDate = (dateString: string) => {
    // Если дата уже в русском формате, просто возвращаем её части
    if (dateString.includes(' ')) {
      const parts = dateString.split(' ');
      if (parts.length >= 3) {
        return {
          day: parts[0],
          month: parts[1],
          year: parts[2]
        };
      }
    }
    
    // Если дата в формате ISO или другом, парсим как Date
    const date = new Date(dateString);
    const day = date.getDate();
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                   'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return { day, month, year };
  };

  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <h1 className="page-title">Новости</h1>
          <p className="lead">Следите за развитием проекта и культурными событиями</p>
        </div>
      </section>

      <section className="section" style={{ minHeight: '60vh' }}>
        <div className="container">
          <div className="news-archive">
            {loading ? (
              <p className="lead" style={{ textAlign: 'center' }}>Загрузка...</p>
            ) : (
              <>
                {news.map((item) => {
                  const { day, month, year } = formatDate(item.date);
                  return (
                    <article key={item.id} className="news-archive-item">
                      <div className="news-archive__date">
                        <span className="day">{day}</span>
                        <span className="month">{month}</span>
                        <span className="year">{year}</span>
                      </div>
                      <div className="news-archive__content">
                        {item.imageUrl && (
                          <div className="news-archive__image">
                            <img src={item.imageUrl} alt={item.title} />
                          </div>
                        )}
                        <h2>
                          <Link to={`/news/${item.id}`}>{item.title}</Link>
                        </h2>
                        <p className="news-archive__meta">{item.readTime}</p>
                        <p>{item.excerpt}</p>
                        <Link to={`/news/${item.id}`} className="btn btn-small">Читать далее</Link>
                      </div>
                    </article>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default News;
