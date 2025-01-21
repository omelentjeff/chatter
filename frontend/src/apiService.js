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
    return response.data;
  } catch (error) {
    console.error("Error fetching unread counts:", error);
  }
};

export const markMessagesAsRead = async (token, chatId, userId) => {
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

export const searchByUsername = async (token, username) => {
  try {
    const response = await axios.get(
      `${baseUrl}/users/search?username=${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200 && !response.data) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error("Error searching by username:", error);
  }
};

export const createChat = async (token, userId, otherUserId) => {
  try {
    const response = await axios.post(
      `${baseUrl}/chats`,
      {
        isGroup: false,
        userIds: [userId, otherUserId],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating chat:", error);
  }
};
