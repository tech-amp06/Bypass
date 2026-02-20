import client from './axiosClient'

export const sendQuery = async (message) => {
  try {
    const response = await client.post('/api/multimodal/gemini', { message })
    // controller returns { text }
    if (response?.data?.text) return response.data.text
    return response.data
  } catch (error) {
    console.error('sendQuery error:', error?.response?.data || error.message || error)
    throw error
  }
}