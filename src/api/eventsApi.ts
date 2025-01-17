import axios from "axios";

interface Event {
  id: string;
  about: string;
  createdAt: string;
  emails: string[];
  guidlines: string[];
  images: { key: string; url: string }[];
  name: string;
  paid: boolean;
  participationCount: number;
  phoneNumbers: string[];
  price: number;
  registrationUrl: string;
  society: {
    name: string;
  };
  websiteUrl: string;
  from: string;
  to: string;
  updatedAt: string;
}

interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface PaginatedResponse<T> {
  currentPage: number;
  nextPage: number | null;
  totalItems: number;
  totalPages: number;
  data: T[];
}

export const getEvents = async (page: number = 1) => {
  try {
    const response = await axios.get<APIResponse<PaginatedResponse<Event>>>(
      `${import.meta.env.VITE_BASE_URL}/api/events?page=${page}&field=createdAt&direction=desc`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("societyToken")}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/events/${eventId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("societyToken")}`,
      },
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

