import axios from 'axios';

const api = axios.create({    
  baseURL: 'http://localhost:5000/', 
});

export const fetchTransactions = (params) => api.get('/transactions', { params });
// export const fetchStatistics = (month) => api.get(`/statistics?month=${month}`);
// export const fetchBarChart = (month) => api.get(`/barChart?month=${month}`);
// export const fetchPieChart = (month) => api.get(`/pieChart?month=${month}`);
// export const fetchCombinedData = (month) => api.get(`/combinedData?month=${month}`);
