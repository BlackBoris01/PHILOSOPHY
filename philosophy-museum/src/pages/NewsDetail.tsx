import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { NewsItem } from '../types/news';
import newsService from '../services/newsService';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      if (!id) return;
      
      try {
        const newsData = await newsService.getNewsById(parseInt(id));
        if (newsData) {
          // Обрабатываем специальный синтаксис изображений
          newsData.content = newsService.processImageSyntax(newsData.content);
        }
        setNews(newsData);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <section className="section page-hero">
        <div className="container">
          <h1 className="page-title">Загрузка...</h1>
        </div>
      </section>
    );
  }

  if (!news) {
    return (
      <section className="section page-hero">
        <div className="container">
          <h1 className="page-title">Новость не найдена</h1>
          <Link to="/news" className="btn">← К списку новостей</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container article-container">
        <Link to="/news" className="back-link">← К списку новостей</Link>

        <header className="article-header">
          <div className="article-meta">
            <span className="article-meta-item">{news.date}</span>
            <span className="article-meta-item">{news.readTime}</span>
          </div>
          <h1 className="article-title">{news.title}</h1>
          {news.subtitle && <p className="article-subtitle">{news.subtitle}</p>}
        </header>

        <div className="article-layout">
          <article className="article-content">
            {news.imageUrl && (
              <figure className="article-figure">
                <img src={news.imageUrl} alt={news.title} />
                <figcaption>Иллюстрация к новости</figcaption>
              </figure>
            )}
            <div dangerouslySetInnerHTML={{ __html: news.content }} />
          </article>

          {news.tableOfContents && news.tableOfContents.length > 0 && (
            <aside className="article-toc">
              <h3>Оглавление</h3>
              <ul>
                {news.tableOfContents.map((item) => (
                  <li key={item.id} style={{ marginLeft: `${(item.level - 1) * 12}px` }}>
                    <a href={`#${item.id}`}>{item.title}</a>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsDetail;
