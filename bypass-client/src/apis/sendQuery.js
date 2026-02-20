import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const PORT = import.meta.env.VITE_PORT;

export const sendQuery = async (message) => {
  try {
    console.log(`${API_URL}:${PORT}/gemini`, message);
    
    const response = await axios.post(`${API_URL}:${PORT}/api/multimodal/gemini`, { message });

    console.log(response.data);
    if (response.text) {
      return response.text;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
}