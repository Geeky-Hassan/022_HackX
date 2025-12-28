// -----------------------
// Imports
// -----------------------
import Cookies from "js-cookie";
// Note: This handler needs to be refactored to work with our custom toast system
// For now, keeping console.error instead of toast
// import toast from "react-hot-toast";
import axios from "axios";
import {removingToken} from "../components/global/constants";

// -----------------------
// Fetching all the recommended people
// -----------------------

export const fetchRecommendedPeople = async () => {
  try {
    const res = await axios.get("https://campuscompanionserver.fly.dev/v1/recommendations", {
      // -----------------------
      // temporarily fetching all users instead of friends
      // -----------------------
      headers: {
        Authorization: `Bearer ${Cookies.get("serviceToken")}`,
      },
    });
    return res.data;
  } catch (error: any) {
    if (error.response.status == 401) {
      removingToken();
    }
    console.error("Error fetching users:", error?.response?.data?.error || error.message);
    console.error("An error occurred while sending the friend request");
    return [];
  }
};

// -----------------------
// Fetching all the friend requests
// -----------------------
export const fetchFriendRequests = async () => {
  try {
    const res = await axios.get(
      "https://campuscompanionserver.fly.dev/v1/friends/requests/received",
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("serviceToken")}`,
        },
      },
    );
    return res.data;
  } catch (error: any) {
    if (error.status !== 404) {
      console.error(
        "Error fetching friend requests:",
        error?.response?.data?.error || error.message,
      );
      console.error("An error occurred while fetching the friend request");
    }
    return [];
  }
};

// -----------------------
// Fetching all the friends
// -----------------------
export const fetchFriends = async () => {
  try {
    const res = await axios.get("https://campuscompanionserver.fly.dev/v1/friends", {
      // -----------------------
      // temporarily fetching all users instead of friends
      // -----------------------
      headers: {
        Authorization: `Bearer ${Cookies.get("serviceToken")}`,
      },
    });

    return res.data;
  } catch (error: any) {
    console.error("Error fetching users:", error?.response?.data?.error || error.message);
    console.error("An error occurred while fetching friends");
    return [];
  }
};

// -----------------------
// Send friend request to the friends
// -----------------------
export const sendFriendRequest = async (userId: string): Promise<boolean> => {
  try {
    await axios.post(
      "https://campuscompanionserver.fly.dev/v1/friends/request",
      {
        requested_user: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("serviceToken")}`,
        },
      },
    );

    return true;
  } catch (error: any) {
    if (error.response.status == 401) {
      removingToken();
    } else {
      console.error("Error sending friend request:", error?.response?.data?.error || error.message);
      console.error(error.response.data.error);
    }
    return false;
  }
};

// -----------------------
// In case you have accepted the friend request
// -----------------------
export const acceptFriendRequest = async (requestId: string, router: any) => {
  try {
    await axios.post(
      "https://campuscompanionserver.fly.dev/v1/friends/accept",
      {
        requestId,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("serviceToken")}`,
        },
      },
    );
    console.log("Friend request accepted successfully");
    router.refresh();
  } catch (error: any) {
    if (error.response.status == 401) {
      removingToken();
    } else {
      console.error(
        "Error accepting friend request:",
        error?.response?.data?.error || error.message,
      );
      console.error("An error occurred while accepting friend request");
    }
  }
};

// -----------------------
// In case you have rejected the friend request
// -----------------------
export const rejectFriendRequest = async (requestId: string) => {
  try {
    await axios.post(
      "https://campuscompanionserver.fly.dev/v1/friends/reject",
      {
        requestId,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("serviceToken")}`,
        },
      },
    );
    console.log("Friend request rejected successfully");
  } catch (error: any) {
    if (error.response.status == 401) {
      removingToken();
    } else {
      console.error(error);
      console.error(
        "Error rejecting friend request:",
        error?.response?.data?.error || error.message,
      );
    }
  }
};

// -----------------------
// Unfriending a friend
// -----------------------
export const removeFriend = async (friendId: string | undefined) => {
  try {
    await axios.delete(`https://campuscompanionserver.fly.dev/v1/friends/remove/${friendId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("serviceToken")}`,
      },
    });
    console.log("User unfriend successfully!");
  } catch (error: any) {
    if (error.response.status == 401) {
      removingToken();
    } else {
      console.error(error);
      console.error("Error removing friend:", error?.response?.data?.error || error.message);
    }
  }
};
