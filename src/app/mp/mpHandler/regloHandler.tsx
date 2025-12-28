// ----------------------
// Imports
// ----------------------
import Cookies from "js-cookie";
import stateStore from "@/store/zuStore";
import axios from "axios";
// ----------------------
// Registering user
// ----------------------
export const UserRegisterHandler = async (values: any) => {
  try {
    const res = await axios.post("/api/register", values);
    const data = res.data;
    const {setEmail} = stateStore.getState();
    setEmail(values.email);
    return {
      message: res.data.message + ". Redirecting you to OTP page",
      status: res.status,
      data: data,
    };
  } catch (error: any) {
    // ----------------------
    // You can also check for error.response for better error details if needed
    // ----------------------
    return {error: error.message, status: error.response ? error.response.status : 500};
  }
};

// ----------------------
// Logging user in
// ----------------------
export const UserLoginHandler = async (values: any) => {
  const {setUserName, setUser, setEmail} = stateStore.getState();
  try {
    const res = await axios.post("/api/login", values);
    const data = res.data;

    Cookies.set("serviceToken", data.token);
    setUser(data.user);
    setUserName(data.user.name);

    return {message: "Success Logging in", status: res.status, data: data};
  } catch (error: any) {
    // ----------------------
    // You can also check for error.response for better error details if needed
    // ----------------------
    if (error.response.status == 401) {
      return {
        message: "Incorrect email or password!",
        status: error.response ? error.response.status : 401,
      };
    } else if (error.response.status === 403) {
      setEmail(values.email);
      return {
        message: "Please verify your email! Redirecting you to OTP page.",
        status: error.response ? error.response.status : 403,
      };
    }
    return {message: error, status: error.response ? error.response.status : 500};
  }
};

// ----------------------
// Validating OTP
// ----------------------
export const validateOTP = async (values: {email: string; otp: string}) => {
  try {
    const res = await axios.post(
      "https://campuscompanionserver.fly.dev/v1/auth/verify-email",
      values,
    );
    const data = res.data;

    return {message: data.message + ". Please login!", status: res.status, data: data};
  } catch (error: any) {
    // ----------------------
    // You can also check for error.response for better error details if needed
    // ----------------------
    if (error.response.status == 400) {
      return {
        message: "Incorrect OTP!",
        status: 400,
      };
    }
    return {message: error.message, status: error.response ? error.response.status : 500};
  }
};
// ----------------------
// Resending OTP
// ----------------------
export const resendOTP = async (email: string) => {
  try {
    const res = await axios.post("https://campuscompanionserver.fly.dev/v1/auth/resend-otp", {
      email: email,
    });
    const data = res.data;

    return {message: data.message, status: res.status};
  } catch (error: any) {
    // ----------------------
    // You can also check for error.response for better error details if needed
    // ----------------------
    if (error.response.status == 401) {
      return {
        message: error,
        status: error.response ? error.response.status : 401,
      };
    }
    return {message: error.message, status: error.response ? error.response.status : 500};
  }
};
