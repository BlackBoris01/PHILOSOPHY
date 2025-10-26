import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
}

const AdminContacts: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    // Имитация загрузки сообщений
    setTimeout(() => {
      const mockMessages: ContactMessage[] = [
        {
          id: 1,
          name: 'Анна Петрова',
          email: 'anna.petrova@email.com',
          phone: '+7 (999) 123-45-67',
          subject: 'Вопрос о экскурсиях',
          message: 'Здравствуйте! Хотела бы узнать, проводятся ли экскурсии для школьников? Какие есть программы для детей?',
          date: '2025-01-15',
          status: 'new'
        },
        {
          id: 2,
          name: 'Михаил Иванов',
          email: 'mikhail.ivanov@email.com',
          subject: 'Предложение сотрудничества',
          message: 'Добрый день! Представляю философский клуб "Мысль". Хотел бы обсудить возможность совместных мероприятий.',
          date: '2025-01-14',
          status: 'read'
        },
        {
          id: 3,
          name: 'Елена Смирнова',
          email: 'elena.smirnova@email.com',
          phone: '+7 (999) 987-65-43',
          subject: 'Благодарность',
          message: 'Спасибо за интересную лекцию о Сократе! Очень понравилось. Когда будут следующие мероприятия?',
          date: '2025-01-13',
          status: 'replied'
        }
      ];
      setMessages(mockMessages);
      setLoading(false);
    }, 1000);
  }, []);

  const handleStatusChange = (id: number, status: ContactMessage['status']) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, status } : msg
    ));
  };

  const getStatusBadge = (status: ContactMessage['status']) => {
    const statusConfig = {
      new: { text: 'Новое', class: 'status-new' },
      read: { text: 'Прочитано', class: 'status-read' },
      replied: { text: 'Отвечено', class: 'status-replied' }
    };
    
    const config = statusConfig[status];
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <section className="section page-hero">
          <div className="container">
            <h1 className="page-title">Управление контактами</h1>
            <p className="lead">Загрузка сообщений...</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <div className="admin-header">
            <div>
              <h1 className="page-title">Управление контактами</h1>
              <p className="lead">Сообщения с формы обратной связи</p>
            </div>
            <Link to="/admin" className="btn btn-secondary">
              ← Назад к панели
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contacts-admin">
            <div className="contacts-stats">
              <div className="stat-card">
                <h3>Всего сообщений</h3>
                <span className="stat-number">{messages.length}</span>
              </div>
              <div className="stat-card">
                <h3>Новых</h3>
                <span className="stat-number">{messages.filter(m => m.status === 'new').length}</span>
              </div>
              <div className="stat-card">
                <h3>Прочитанных</h3>
                <span className="stat-number">{messages.filter(m => m.status === 'read').length}</span>
              </div>
              <div className="stat-card">
                <h3>Отвеченных</h3>
                <span className="stat-number">{messages.filter(m => m.status === 'replied').length}</span>
              </div>
            </div>

            <div className="messages-list">
              <h2>Список сообщений</h2>
              {messages.length === 0 ? (
                <p>Сообщений пока нет</p>
              ) : (
                <div className="messages-grid">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`message-card ${message.status === 'new' ? 'message-card--new' : ''}`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="message-card__header">
                        <h3>{message.subject}</h3>
                        {getStatusBadge(message.status)}
                      </div>
                      <div className="message-card__meta">
                        <p><strong>{message.name}</strong></p>
                        <p>{message.email}</p>
                        {message.phone && <p>{message.phone}</p>}
                        <p className="message-date">{formatDate(message.date)}</p>
                      </div>
                      <div className="message-card__preview">
                        <p>{message.message.substring(0, 100)}...</p>
                      </div>
                      <div className="message-card__actions">
                        <button 
                          className="btn btn-small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMessage(message);
                          }}
                        >
                          Подробнее
                        </button>
                        {message.status === 'new' && (
                          <button 
                            className="btn btn-small btn-secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(message.id, 'read');
                            }}
                          >
                            Отметить прочитанным
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Модальное окно для просмотра сообщения */}
      {selectedMessage && (
        <div className="modal-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedMessage.subject}</h2>
              <button 
                className="modal-close"
                onClick={() => setSelectedMessage(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="message-details">
                <div className="message-info">
                  <p><strong>От:</strong> {selectedMessage.name}</p>
                  <p><strong>Email:</strong> {selectedMessage.email}</p>
                  {selectedMessage.phone && <p><strong>Телефон:</strong> {selectedMessage.phone}</p>}
                  <p><strong>Дата:</strong> {formatDate(selectedMessage.date)}</p>
                  <p><strong>Статус:</strong> {getStatusBadge(selectedMessage.status)}</p>
                </div>
                <div className="message-text">
                  <h3>Сообщение:</h3>
                  <p>{selectedMessage.message}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="status-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleStatusChange(selectedMessage.id, 'read')}
                >
                  Отметить прочитанным
                </button>
                <button 
                  className="btn"
                  onClick={() => handleStatusChange(selectedMessage.id, 'replied')}
                >
                  Отметить отвеченным
                </button>
              </div>
              <button 
                className="btn btn-secondary"
                onClick={() => setSelectedMessage(null)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminContacts;

