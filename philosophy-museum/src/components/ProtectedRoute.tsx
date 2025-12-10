import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  console.log('[ProtectedRoute] Checking authentication...');
  
  // Проверяем все необходимые данные
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';
  const sessionToken = localStorage.getItem('sessionToken');
  const sessionExpiry = localStorage.getItem('sessionExpiry');

  console.log('[ProtectedRoute] Auth status:', { isAuth, hasToken: !!sessionToken, hasExpiry: !!sessionExpiry });

  // Если нет авторизации
  if (!isAuth || !sessionToken) {
    console.log('[ProtectedRoute] Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Проверяем срок действия сессии
  if (sessionExpiry) {
    const expiryTime = parseInt(sessionExpiry, 10);
    if (Date.now() > expiryTime) {
      console.log('[ProtectedRoute] Session expired');
      clearAuth();
      return <Navigate to="/login" replace />;
    }
  }

  // Проверяем формат токена
  if (!sessionToken.startsWith('token_')) {
    console.log('[ProtectedRoute] Invalid token format');
    clearAuth();
    return <Navigate to="/login" replace />;
  }

  console.log('[ProtectedRoute] Authenticated successfully, rendering children');
  return <>{children}</>;
};

// Функция очистки данных аутентификации
function clearAuth() {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('adminUser');
  localStorage.removeItem('sessionToken');
  localStorage.removeItem('sessionExpiry');
}

export default ProtectedRoute;
