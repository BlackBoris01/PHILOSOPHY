import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_TIME = 15 * 60 * 1000; // 15 минут

  // Проверяем блокировку при загрузке
  useEffect(() => {
    const lockoutUntil = localStorage.getItem('loginLockoutUntil');
    if (lockoutUntil && Date.now() < parseInt(lockoutUntil, 10)) {
      const minutesLeft = Math.ceil((parseInt(lockoutUntil, 10) - Date.now()) / 60000);
      setError(`Слишком много попыток входа. Попробуйте снова через ${minutesLeft} минут`);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверка блокировки
    const lockoutUntil = localStorage.getItem('loginLockoutUntil');
    if (lockoutUntil && Date.now() < parseInt(lockoutUntil, 10)) {
      const minutesLeft = Math.ceil((parseInt(lockoutUntil, 10) - Date.now()) / 60000);
      setError(`Попробуйте снова через ${minutesLeft} минут`);
      return;
    }
    
    // Проверка учетных данных
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      console.log('[Login] Valid credentials, creating session');
      
      // Успешный вход
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('loginLockoutUntil');
      
      // Генерируем сессию
      const sessionToken = `token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      const sessionExpiry = Date.now() + (24 * 60 * 60 * 1000);
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('adminUser', credentials.username);
      localStorage.setItem('sessionToken', sessionToken);
      localStorage.setItem('sessionExpiry', sessionExpiry.toString());
      
      console.log('[Login] Session created, redirecting to /admin');
      navigate('/admin');
    } else {
      // Неверные учетные данные
      const currentAttempts = parseInt(localStorage.getItem('loginAttempts') || '0', 10) + 1;
      localStorage.setItem('loginAttempts', currentAttempts.toString());
      
      if (currentAttempts >= MAX_ATTEMPTS) {
        const lockoutUntil = Date.now() + LOCKOUT_TIME;
        localStorage.setItem('loginLockoutUntil', lockoutUntil.toString());
        setError('Слишком много неверных попыток. Доступ заблокирован на 15 минут.');
      } else {
        setError(`Неверные учетные данные. Попыток осталось: ${MAX_ATTEMPTS - currentAttempts}`);
      }
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
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
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
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    placeholder="Введите пароль"
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
                <p><strong>Пароль:</strong> admin123</p>
                <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '8px' }}>
                  ⚠️ После 5 неверных попыток доступ будет заблокирован на 15 минут
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
