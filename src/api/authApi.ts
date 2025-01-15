import axios from "axios";

export const loginSociety = async (data: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/auth/society/login`,
      {
        email: data.email,
        password: data.password,
      }
    );
    return response;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}; 