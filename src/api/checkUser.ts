
export const checkUser = async () => {
  //check user if token exist
  try {
    const token = sessionStorage.getItem("societyToken");
    if (token) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error fetching user email:", error);
    throw error;
  }
};
