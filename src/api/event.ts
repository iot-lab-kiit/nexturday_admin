import api from "@/api/api_instance";

export const getEvents = async (page:number) => {
  try {
    const response = await api.get("/api/events/society", {
      params: {
        page: page,
        field: "createdAt",
        direction: "desc",
      },
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const getEventDetails = async (eventId: string) => {
  try {
    const response = await api.get(`/api/events/${eventId}`);
    return response;
  } catch (error) {
    console.error("Error fetching event details:", error);
    throw error;
  }
};

export const getParticipants = async (id: string, currentPage: number) => {
  try {
    const response = await api.get(`/api/events/society/${id}/participants`, {
      params: {
        page: currentPage,
        field: "createdAt",
        direction: "desc",
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching participants:", error);
    throw error;
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    const response = await api.delete(`/api/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

export const CreateEvent = async (formData: FormData) => {
  try {
    const response = await api.post(`/api/events/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${sessionStorage.getItem("societyToken")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};
