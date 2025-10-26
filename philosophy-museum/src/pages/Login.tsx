import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Простая проверка (в реальном приложении будет API)
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      // Сохраняем состояние авторизации в localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('adminUser', credentials.username);
      
      // Перенаправляем в админ панель
      navigate('/admin');
    } else {
      setError('Неверные учетные данные');
    }
  };

  return (
    <>
      <section className="section page-hero">
        <div className="container">
          <h1 className="page-title">Авторизация</h1>
          <p className="lead">Вход в админ панель музея философии</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="login-container">
            <div className="login-form">
              <h2>Вход в систему</h2>
              <p className="login-subtitle">Введите данные для доступа к админ панели</p>
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Имя пользователя</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={credentials.username}
                    onChange={handleInputChange}
                    placeholder="admin"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Пароль</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    placeholder="admin"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Войти
                </button>
              </form>

              <div className="login-info">
                <h3>Тестовые данные:</h3>
                <p><strong>Логин:</strong> admin</p>
                <p><strong>Пароль:</strong> admin</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;

