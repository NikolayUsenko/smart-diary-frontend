import axios from 'axios';

const API_URL = 'http://localhost:5140/api';

const authService = {
  // Регистрация
  async register(username, email, password, password2) {
    const response = await axios.post(`${API_URL}/Auth/register`, {
      username,
      email,
      password,
      password2
    });

    if (response.data.accessToken) {
      localStorage.setItem('access_token', response.data.accessToken);
      localStorage.setItem('refresh_token', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  // Вход
  async login(username, password) {
    const response = await axios.post(`${API_URL}/Auth/login`, {
      username,
      password
    });

    if (response.data.accessToken) {
      localStorage.setItem('access_token', response.data.accessToken);
      localStorage.setItem('refresh_token', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  // Обновление access токена
  async refreshToken() {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) return null;

    try {
      const response = await axios.post(`${API_URL}/Auth/refresh`, {
        refreshToken: refresh
      });

      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        if (response.data.refresh) {
          localStorage.setItem('refresh_token', response.data.refresh);
        }
      }

      return response.data;
    } catch (error) {
      this.logout();
      return null;
    }
  },

  // Выход
  async logout() {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        await axios.post(`${API_URL}/Auth/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  // Получение текущего пользователя
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Проверка авторизации
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }
};

export default authService;