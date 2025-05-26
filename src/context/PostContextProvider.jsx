import axios from 'axios';
import { createContext } from 'react';

export const postContext = createContext();

export default function AuthProvider({ children }) {
  const { VITE_API_URL } = import.meta.env;

  async function createPost(post) {
    try {
      const response = await axios.post(`${VITE_API_URL}/posts`, post, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      return error.response.data.error;
    }
  }

  async function getPosts({ page, limit, type, location }) {
    try {
      const response = await axios.get(
        `${VITE_API_URL}/posts?page=${page}&limit=${limit}&type=${type}&location=${location}`,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return error.response.data.error;
    }
  }

  async function createComment(postId, comment) {
    try {
      const response = await axios.post(`${VITE_API_URL}/posts/${postId}/comment`, comment, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      return error.response.data.error;
    }
  }
  async function likeUnlikePost(postId) {
    try {
      const response = await axios.post(
        `${VITE_API_URL}/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return error.response.data.error;
    }
  }

  return (
    <postContext.Provider value={{ createPost, getPosts, createComment, likeUnlikePost }}>
      {children}
    </postContext.Provider>
  );
}
