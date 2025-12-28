import axios from "axios";

export const quizResultHandler = async (values: any) => {
  try {
    const response = await axios.post("/api/quiz", {
      values,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return {message: "Quiz submission success!", status: 200};
    } else {
      return {message: response.data.message, status: response.status};
    }

    return {};
  } catch (error) {
    return {message: "An error occurred while submitting the quiz results.", status: 500};
  }
};
