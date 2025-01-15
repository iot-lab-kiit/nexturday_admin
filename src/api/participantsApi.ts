import axios from "axios";

export const fetchParticipants = async (eventId: string, currentPage: number) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/events/society/${eventId}/participants?page=${currentPage}&field=createdAt&direction=desc`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching participants:", error);
    throw error;
  }
}; 