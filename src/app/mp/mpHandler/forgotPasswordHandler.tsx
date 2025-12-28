import axios from "axios";

export const forgotPasswordEmail = async (value: any) => {
  try {
    const values = {
      email: value.userEmail,
    };
    const res = await axios.post("https://campuscompanionserver.fly.dev/v1/auth/forgot", values);
    const data = res.data.message;

    return {data, status: res.status};
  } catch (error: any) {
    if (error.response.status == 404) {
      return {
        error: "User not found",
        status: 404,
      };
    }
    return {error, status: error.status};
  }
};

export const newPasswordHandler = async (values: any) => {
  try {
    const res = await axios.patch(
      `https://campuscompanionserver.fly.dev/v1/auth/forgot/reset?token=${values.token}`,
      values,
    );

    if (res.status == 200) {
      return {message: "Password updated successfully!", status: res.status};
    }
    return {message: "Password can't be updated!", status: res.status};
  } catch (error: any) {
    return {error, status: error.status};
  }
};
