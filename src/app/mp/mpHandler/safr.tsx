// ----------------------
// Imports
// ----------------------
import {SupportType} from "@/types";
import axios from "axios";
import {removingToken} from "../components/global/constants";
import Cookies from "js-cookie";
// ----------------------
// Calling for support
// ----------------------
export const supportHandler = async (values: SupportType) => {
  try {
    const res = await axios.post("https://campuscompanionserver.fly.dev/v1/support", values,{
      headers: {
        Authorization: `Bearer ${Cookies.get("serviceToken")}`,
      },
    });
    return {
      message: "We have received your message, and will get back to you soon",
      status: res.status,
    };
  } catch (error: any) {
    if (error.response.status == 401) {
      removingToken();
    } else {
      console.error("Error:", error?.response?.data?.error || error.message);
      return {message: error.message, status: error.status};
    }
  }
};
