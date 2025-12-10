import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const adminSections = [
    {
      id: 'news',
      title: 'Управление новостями',
      description: 'Создание, редактирование и удаление новостей',
      icon: '📰',
      link: '/admin/news',
      color: 'var(--primary)'
    },
    {
      id: 'home',
      title: 'Управление главной',
      description: 'Редактирование контента главной страницы',
      icon: '🏠',
      link: '/admin/home',
      color: '#10b981'
    },
    {
      id: 'about',
      title: 'Управление страницей о музее',
      description: 'Редактирование информации о музее, команде и партнерах',
      icon: 'ℹ️',
      link: '/admin/about',
      color: '#f59e0b'
    },
    {
      id: 'exhibitions',
      title: 'Управление экспозициями',
      description: 'Создание и управление экспозициями музея',
      icon: '🎨',
      link: '/admin/exhibitions',
      color: '#8b5cf6'
    },
    {
      id: 'events',
      title: 'Управление мероприятиями',
      description: 'Создание и управление проектами и мероприятиями',
      icon: '📅',
      link: '/admin/events',
      color: '#ef4444'
    },
    {
      id: 'contacts',
      title: 'Управление контактами',
      description: 'Просмотр сообщений с формы обратной связи',
      icon: '📞',
      link: '/admin/contacts',
      color: '#06b6d4'
    }
  ];

  const handleLogout = () => {
    // Полная очистка всех данных аутентификации
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('sessionExpiry');
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('loginLockoutUntil');
    window.location.href = '/login';
  };

  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <div className="admin-header">
            <div>
              <h1 className="page-title">Админ панель</h1>
              <p className="lead">Управление контентом музея философии</p>
            </div>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="admin-dashboard">
            <h2 className="section-title">Разделы управления</h2>
            <div className="admin-sections-grid">
              {adminSections.map((section) => (
                <Link 
                  key={section.id} 
                  to={section.link} 
                  className="admin-section-card"
                  style={{ '--section-color': section.color } as React.CSSProperties}
                >
                  <div className="admin-section-card__icon">
                    {section.icon}
                  </div>
                  <div className="admin-section-card__content">
                    <h3>{section.title}</h3>
                    <p>{section.description}</p>
                  </div>
                  <div className="admin-section-card__arrow">
                    →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;

