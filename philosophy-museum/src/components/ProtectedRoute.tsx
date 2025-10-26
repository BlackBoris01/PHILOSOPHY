import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Проверяем аутентификацию после монтирования компонента
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    setIsLoading(false);
  }, []);

  // Показываем загрузку пока проверяем аутентификацию
  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Загрузка...</h1>
        <p>Проверка авторизации...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
