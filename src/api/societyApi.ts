import axios from "axios";

export const updateSocietyProfile = async (data: {
  name: string;
  description: string;
  websiteUrl: string;
  email: string;
  password: string;
  phoneNumber: string;
}) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/api/society`,
      {
        name: data.name,
        desc: data.description,
        websiteUrl: data.websiteUrl,
        email: data.email,
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