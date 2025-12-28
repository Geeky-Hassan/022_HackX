// -----------------------
// Imports
// -----------------------
import Cookies from "js-cookie";
import axios from "axios";
// Note: This handler needs to be refactored to work with our custom toast system
// For now, keeping console.error instead of toast
// import toast from "react-hot-toast";
import { removingToken } from "../../components/global/constants";

// -----------------------
// Fetching all the conversations
// -----------------------
export const fetchChats = async () => {
  try {
    const res = await axios.get(`https://campuscompanionserver.fly.dev/v1/messages/`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("serviceToken")}`,
      },
    });

    return res.data;
  } catch (error: any) {
    if (error.response.status == 401) {
      removingToken();
    } else {
      console.error("Error fetching chats:", error?.response?.data?.error || error.message);
      console.error("An error occurred while fetching chats");
    }
    return [];
  }
};
// -----------------------
// Read conversations
// -----------------------
export const markAsRead = async (friendId: string) => {
  try {
    await axios.put(
      `https://campuscompanionserver.fly.dev/v1/messages/read/${friendId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("serviceToken")}`,
        },
      },
    );
  } catch (error: any) {
    if (error.response.status == 401) {
      removingToken();
    }
    console.error("Error marking as read:", error?.response?.data?.error || error.message);
  }
};
// -----------------------
// Fetching chat messages
// -----------------------
export const fetchChatMessages = async (userId: string) => {
  try {
    const res = await axios.get(`https://campuscompanionserver.fly.dev/v1/messages/${userId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("serviceToken")}`,
      },
    });
    return res.data.reverse();
  } catch (error: any) {
    if (error.response.status == 401) {
      removingToken();
    }
    console.error("Error fetching messages:", error?.response?.data?.error || error.message);
    console.error("An error occurred while fetching messages");
    return [];
  }
};
