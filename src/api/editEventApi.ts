import axios from "axios";

export const fetchEvent = async (eventId: string | undefined) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/events/${eventId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("societyToken")}`,
        },
      }
    );

    // console.log("response", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
};

export const updateEvent = async (
  eventId: string | undefined,
  formData: FormData
) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/api/events/${eventId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${sessionStorage.getItem("societyToken")}`,
        },
      }
    );

    return response.data
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};
