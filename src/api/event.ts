import api from "@/api/api_instance";
import axios from "axios";

export const getEvents = async (page: number) => {
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

export const getAllEvents = async (page: number) => {
  try {
    const response = await api.get("/api/admin/events", {
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

export const rejectEvent = async (id: string) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/api/admin/event/reject/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("societyToken")}`,
        },
      }
    );
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error rejecting event:", error);
    throw error;
  }
};

export const approveEvent = async (id: string) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/api/admin/event/approve/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("societyToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error approving event:", error);
    throw error;
  }
};

export const getPendingEvents = async (page: number) => {
  try {
    const response = await api.get("/api/admin/events", {
      params: {
        page: page,
        field: "createdAt",
        direction: "desc",
        isApproved: false,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching pending events:", error);
    throw error;
  }
};

export const getApprovedEvents = async (page: number) => {
  try {
    const response = await api.get("/api/admin/events", {
      params: {
        page: page,
        field: "createdAt",
        direction: "desc",
        isApproved: true,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching checked events:", error);
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
    console.error("Error Creating event:", error);
    throw error;
  }
};
