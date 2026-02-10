import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔥 THE FIX: Only clear token and redirect if the error is 401 
    // AND we are not currently trying to log in.
    if (error.response?.status === 401) {
      const isLoginRequest = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/google');
      
      if (!isLoginRequest) {
        console.warn("Unauthorized access - clearing session");
        localStorage.removeItem('userToken');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export const authService = {
  login: async (credentials: any) => {
    const res = await api.post('/auth/login/', credentials);
    // Standardize token capture
    const token = res.data.access || res.data.key || res.data.token || res.data.access_token;
    if (token) {
      localStorage.setItem('userToken', token);
    }
    return res.data;
  },

  googleLogin: async (googleData: { code: string }) => {
    const payload = { code: googleData.code, callback_url: "postmessage" };
    const res = await api.post('/auth/google/', payload);
    
    // 🔥 CRITICAL: Log this to your console to see what the backend is sending
    console.log("Backend Response:", res.data);
    
    const token = res.data.access || res.data.key || res.data.token || res.data.access_token;
    if (token) {
      localStorage.setItem('userToken', token);
    }
    return res.data;
  },
  signup: async (data: any) => {
    return (await api.post('/auth/signup/', { ...data, phone: "" })).data;
  },
  getProfile: async () => (await api.get('/auth/user/')).data,
  getSavedAddresses: async () => (await api.get('/auth/addresses/')).data,
  saveAddress: async (data: any) => (await api.post('/auth/addresses/', data)).data,
  deleteAddress: async (id: number) => (await api.delete(`/auth/addresses/${id}/`)).data,
  setDefaultAddress: async (id: number) => (await api.post(`/auth/addresses/${id}/set-default/`)).data
};

export const orderService = {
  getUserOrders: async () => (await api.get('/orders/')).data,
};

export default api;