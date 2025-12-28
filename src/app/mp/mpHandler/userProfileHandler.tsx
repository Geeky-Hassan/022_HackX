// ----------------------
// Imports
// ----------------------
import axios from "axios";
import Cookies from "js-cookie";

// ----------------------
// Handling user profile update
// ----------------------
export const userProfileHandler = async (values: any) => {
  
  try {
    const res = await axios.put(
      "https://campuscompanionserver.fly.dev/v1/users",
      {
        ...values,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("serviceToken")}`,
        },
      },
    );  
    return {message: res.data.message, status: res.status};
  } catch (error: any) {
    return {message: error.message, status: error.response.status};
  }
};
