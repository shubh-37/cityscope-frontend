import axios from 'axios';
import { createContext } from 'react';

export const authContext = createContext();

export default function AuthProvider({ children }) {
  const { VITE_API_URL } = import.meta.env;
  async function signUpUser(user) {
    try {
      const response = await axios.post(`${VITE_API_URL}/users/signup`, user, {
        timeout: 10000
      });
      if (response.status === 201) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return { status: 200, message: response.data.message };
      }
    } catch (error) {
      return error.response.data.error;
    }
  }
  async function loginUser(username, password) {
    try {
      const response = await axios.post(
        `${VITE_API_URL}/users/login`,
        { username, password },
        {
          timeout: 10000
        }
      );
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return { status: 200, message: response.data.message };
      }
    } catch (error) {
      return error.response.data.error;
    }
  }
  async function authenticateUser() {
    try {
      const response = await axios.get(`${VITE_API_URL}/users/authenticate`, {
        timeout: 10000,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 200) {
        return 'success';
      }
    } catch (error) {
      return error.response.data.error;
    }
  }

  async function getPostsByUser() {
    try {
      const response = await axios.get(`${VITE_API_URL}/posts/user`, {
        timeout: 10000,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      return error.response.data.error;
    }
  }

  return (
    <authContext.Provider value={{ signUpUser, loginUser, authenticateUser, getPostsByUser }}>
      {children}
    </authContext.Provider>
  );
}
