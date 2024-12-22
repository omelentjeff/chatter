import axios from "axios";

const baseUrl = `${import.meta.env.VITE_API_URL}`;

export const fetchData = async (token, userId) => {
  try {
    const response = await axios.get(`${baseUrl}/users/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data:`, error);
    throw (
      error.response?.data ||
      new Error("An error occurred while fetching data.")
    );
  }
};
