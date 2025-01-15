import axios from 'axios';

export const fetchEventDetails = async (eventId: string|undefined) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/events/${eventId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching event details:", error);
    throw error;
  }
}; 