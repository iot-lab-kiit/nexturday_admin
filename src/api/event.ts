import api from "@/api/api_instance"; // Import the custom Axios instance

export const getEvents = async () => {
  try {
    const response = await api.get("/api/events", {
      params: {
        page: 1,
        field: "createdAt",
        direction: "desc",
      },
    });
    console.log(response.data.data.data);
    return response.data.data.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error; // Rethrow the error if needed
  }
};

export const getParticipants = async (
  id: string,
  page = 1,
  field = "createdAt",
  direction = "desc"
) => {
  try {
    const response = await api.get(`/api/events/society/${id}/participants`, {
      params: { page, field, direction },
    });
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching participants:", error);
    throw error; // Rethrow or handle the error as needed
  }
};
