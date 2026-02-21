import axios from 'axios';

const API_URL = 'http://localhost:3001/api/appointments';

// Helper to get auth headers
const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getAppointments = async (userId) => {
  const response = await axios.get(`${API_URL}/${userId}`, getAuthHeaders());
  return response.data;
};

export const bookAppointment = async (appointmentData) => {
  const response = await axios.post(`${API_URL}/book`, appointmentData, getAuthHeaders());
  return response.data;
};