import axios from 'axios';

const API_URL = import.meta.env.VITE_TEMP_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: 'https://file-sharing-website-gdg1.onrender.com/api' 
});

export default api;
