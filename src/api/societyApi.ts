import axios from "axios";

export const updateSocietyProfile = async (data: {
  name: string;
  websiteUrl: string;
  password: string;
  phoneNumber: string;
}) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/api/society`,
      {
        name: data.name,
        websiteUrl: data.websiteUrl,
        password: data.password,
        phoneNumber: data.phoneNumber,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("societyToken")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating society profile:", error);
    throw error;
  }
};

export const getSocietyProfile = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/society`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("societyToken")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching society profile:", error);
    throw error;
  }
};
