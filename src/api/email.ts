import api from "@/api/api_instance";

export const getUserEmail = async () => {
    try {
        const response = await api.get(`/api/society`);
        return response;
    } catch (error) {
        console.error("Error fetching user email:", error);
        throw error;
    }
}