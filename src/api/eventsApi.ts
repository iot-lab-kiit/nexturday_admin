import axios from "axios";
export const getEvents = async () => {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL
      }/api/events?page=1&field=createdAt&direction=desc`
    );
    return response.data.data.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/api/events/${eventId}`
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};
export const CreateEvent = async (formData: FormData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/events/`,
      { formData },
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${sessionStorage.getItem("societyToken")}`,
        },
      }
    );

    console.log("response.data", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};
