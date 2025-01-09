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

export const fetchMessagesByChatId = async (token, chatId) => {
  try {
    const response = await axios.get(`${baseUrl}/messages/chat/${chatId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Messages fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching messages:`, error);
    throw (
      error.response?.data ||
      new Error("An error occurred while fetching messages.")
    );
  }
};

export const fetchUnreadCounts = async (token, userId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/messages/unreadCounts?userId=${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("Unread counts fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching unread counts:", error);
  }
};

export const markMessagesAsRead = async (token, chatId, userId) => {
  console.log("Token:", token);

  try {
    await axios.put(
      `${baseUrl}/messages/chat/${chatId}/markAsRead`,
      { userId }, // The request body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
};
