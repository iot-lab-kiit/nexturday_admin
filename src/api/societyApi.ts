import axios from "axios";

interface UpdateProfileData {
  name: string;
  phoneNumber: string;
  websiteUrl?: string;
  password?: string;
}

export const updateSocietyProfile = async (data: UpdateProfileData) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/api/society`,
      data,
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
