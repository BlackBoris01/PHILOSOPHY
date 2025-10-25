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
          {loading ? (
            <p className="lead" style={{ textAlign: 'center' }}>Загрузка...</p>
          ) : (
            <>
              {news.map((item) => (
                <article key={item.id} className="news-card hover-lift" style={{ marginBottom: '24px' }}>
                  {item.imageUrl ? (
                    <div className="news-card__grid">
                      <div>
                        <h3>{item.title}</h3>
                        <div className="meta">{item.date} • {item.readTime}</div>
                        <p>{item.excerpt}</p>
                        <Link to={`/news/${item.id}`} className="btn btn-small">Читать далее</Link>
                      </div>
                      <figure className="news-card__media">
                        <img src={item.imageUrl} alt={item.title} />
                      </figure>
                    </div>
                  ) : (
                    <>
                      <h3>{item.title}</h3>
                      <div className="meta">{item.date} • {item.readTime}</div>
                      <p>{item.excerpt}</p>
                      <Link to={`/news/${item.id}`} className="btn btn-small">Читать далее</Link>
                    </>
                  )}
                </article>
              ))}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default News;
