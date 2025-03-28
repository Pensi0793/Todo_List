import axios from 'axios';

const api = axios.create({
  baseURL: 'https://todo-backend.onrender.com', // Thay bằng URL thực tế của backend trên Render
});

export default api;