import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const PORT = import.meta.env.VITE_PORT;

export const verifyUser = async ({ email, password }) => {
  try {
    const response = await axios.post(`${API_URL}:${PORT}/api/auth/login`, {
      email,
      password
    });

    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
}