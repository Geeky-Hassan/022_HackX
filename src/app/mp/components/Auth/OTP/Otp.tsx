"use client";
// ----------------------------
// Imports
// ----------------------------
import React, {useRef, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Formik, Form, ErrorMessage} from "formik"; // Removed Field as we use custom inputs
import {resendOTP, validateOTP} from "../../../mpHandler/regloHandler";
import {useToast} from "../../Toast";
import stateStore from "@/store/zuStore";
import Link from "next/link";
import * as Yup from "yup";

const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

// ----------------------------
// OTP component starts here
// ----------------------------
const Otp = () => {
  const {email} = stateStore();
  const setReglo = stateStore((state) => state.setReglo);
  const [timer, setTimer] = useState<number>(0);
  const [resend, setResend] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]); // Refs for multiple inputs
  const router = useRouter(); // Corrected: useRouter import used as router
  const {showToast} = useToast();

  const OTP_LENGTH = 6; // Define OTP length constant

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, OTP_LENGTH);
  }, []);

  // Focus the first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // --- Resend OTP Logic (same as before) ---
  const handleResend = async () => {
    try {
      setResend(true);
      setTimer(30); // Start timer immediately for visual feedback
      const res = await resendOTP(email);
      showToast({
        message: res.message,
        status: "success",
        duration: 3000,
      });
    } catch (error: any) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Failed to resend OTP. Please try again.";
      showToast({
        message: errorMessage,
        status: "error",
        duration: 6000,
      });
      setResend(false); // Allow trying again if error
      setTimer(0);
    }
  };

  // --- Timer Logic (same as before) ---
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (resend && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer <= 0) {
      setResend(false); // Enable resend button when timer hits 0
      setTimer(0); // Ensure timer is 0
      if (interval) {
        clearInterval(interval);
      }
    }
    // Cleanup interval on component unmount or when conditions change
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [resend, timer]); // Rerun effect when resend or timer changes

  // --- Redirect Logic (same as before) ---
  if (!email) {
    // Check if email is null/undefined/empty
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-dark-custom-dark-blue text-3xl pb-5">Please Register First</h1>
        <Link className="text-dark-logo-primary hover:underline text-lg" href={"/mp/login"}>
          Go to Register/Login
        </Link>
      </div>
    );
  }

  // --- Multi-Input Handlers ---
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    values: string[], // Local state for individual inputs
    setValues: React.Dispatch<React.SetStateAction<string[]>>, // Setter for local state
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void, // Formik's setter
  ) => {
    const {value} = e.target;
    const newValues = [...values];

    // Allow only one digit per input
    const digit = value.match(/\d/); // Get the first digit entered/pasted
    newValues[index] = digit ? digit[0] : ""; // Update the specific input's value

    setValues(newValues); // Update local state holding individual input values

    // Combine values and update Formik state
    const combinedOtp = newValues.join("");
    setFieldValue("otp", combinedOtp, combinedOtp.length === OTP_LENGTH); // Validate only when full

    // Move focus to the next input if a digit was entered and it's not the last input
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    values: string[],
    setValues: React.Dispatch<React.SetStateAction<string[]>>,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
  ) => {
    if (e.key === "Backspace") {
      // If Backspace is pressed and the current input is empty, move focus to the previous input
      if (!values[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        // If input has value, clear it (handleChange will handle state update on next input event,
        // but clear local state immediately for responsiveness)
        const newValues = [...values];
        newValues[index] = "";
        setValues(newValues);
        const combinedOtp = newValues.join("");
        setFieldValue("otp", combinedOtp, false); // Update formik value, don't validate yet
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    values: string[],
    setValues: React.Dispatch<React.SetStateAction<string[]>>,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
  ) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, ""); // Remove non-digits
    if (!pastedData) return;

    const newValues = [...values];
    let currentFocusIndex = 0;

    // Distribute pasted digits into the inputs
    for (let i = 0; i < OTP_LENGTH; i++) {
      if (i < pastedData.length) {
        newValues[i] = pastedData[i];
        if (i < OTP_LENGTH - 1) {
          currentFocusIndex = i + 1; // Plan to focus next input
        } else {
          currentFocusIndex = i; // Stay on last if fully pasted
        }
      }
    }
    setValues(newValues); // Update local input values

    const combinedOtp = newValues.join("");
    setFieldValue("otp", combinedOtp, combinedOtp.length === OTP_LENGTH); // Update Formik state & validate if complete

    // Move focus
    inputRefs.current[currentFocusIndex]?.focus();
    // Select the content of the focused input for better UX after paste
    inputRefs.current[currentFocusIndex]?.select();
  };

  // ----------------------------
  // Render OTP page
  // ----------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md w-full max-w-md">
        {" "}
        {/* Adjusted max-width */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-800">
          Enter OTP
        </h2>
        <p className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
          An OTP has been sent to <span className="font-medium">{email}</span>.
        </p>
        <Formik
          initialValues={{otp: ""}} // Formik holds the combined OTP string
          validationSchema={otpSchema}
          onSubmit={async (values, {setSubmitting: formikSetSubmitting}) => {
            formikSetSubmitting(true);

            const dataToSend = {
              email: email,
              otp: values.otp, // Send the combined OTP string
            };
            try {
              const resp = await validateOTP(dataToSend);
              if (resp.status === 200) {
                showToast({
                  message: resp.message || "OTP validated successfully!",
                  status: "success",
                  duration: 3000,
                });
                setReglo(); // Update registration status in store
                router.push("/mp/login"); // Redirect on success
              } else {
                showToast({
                  message: resp.message || "Invalid OTP or validation failed.",
                  status: "error",
                  duration: 6000,
                });
              }
            } catch (error: any) {
              const errorMessage =
                typeof error === "string"
                  ? error
                  : error?.message || "An error occurred during OTP validation.";
              showToast({
                message: errorMessage,
                status: "error",
                duration: 4000,
              });
            } finally {
              formikSetSubmitting(false);
            }
          }}
        >
          {/* Get Formik helpers */}
          {({setFieldValue, isSubmitting, errors, touched}) => {
            // Local state to manage the value of each individual input box
            const [inputValues, setInputValues] = useState<string[]>(Array(OTP_LENGTH).fill(""));

            return (
              <Form>
                <div
                  className="flex justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6"
                  role="group"
                  aria-label="One-Time Password Input"
                >
                  {/* Render 6 input fields */}
                  {inputValues.map((value, index) => (
                    <input
                      key={index}
                      ref={(el) => void (inputRefs.current[index] = el)} // Assign ref
                      type="text" // Use text to handle paste better initially
                      inputMode="numeric" // Hint for mobile keyboard
                      maxLength={1} // Each input holds only one digit
                      value={value} // Controlled component using local state
                      onChange={(e) =>
                        handleInputChange(e, index, inputValues, setInputValues, setFieldValue)
                      }
                      onKeyDown={(e) =>
                        handleKeyDown(e, index, inputValues, setInputValues, setFieldValue)
                      }
                      onPaste={(e) => handlePaste(e, inputValues, setInputValues, setFieldValue)} // Paste handler, mainly effective on first input but safe on all
                      className={`
                                                w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16
                                                text-center text-lg sm:text-xl md:text-2xl font-semibold
                                                border rounded-md shadow-sm
                                                focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none
                                                dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400
                                                ${errors.otp && touched.otp ? "border-red-500 dark:border-red-500 focus:ring-red-500" : "border-gray-300"}
                                            `}
                      aria-label={`Digit ${index + 1}`} // Accessibility
                    />
                  ))}
                </div>

                {/* Display combined validation error */}
                <ErrorMessage
                  name="otp"
                  component="div"
                  className="text-red-500 text-sm mb-4 text-center"
                />

                {/* Resend and Submit buttons (same as before) */}
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <button
                    type="button"
                    className={`text-sm hover:underline ${resend ? "text-gray-500 cursor-not-allowed" : "text-blue-500 dark:text-blue-400"}`}
                    onClick={handleResend}
                    disabled={resend} // Disable based on resend state
                  >
                    Resend Code {resend && timer > 0 ? `(${timer}s)` : ""}
                  </button>
                </div>
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <p className={`text-sm text-gray-500`}>
                    Please check your spam, if you don&apos;t receive our email.
                  </p>
                </div>

                <button
                  disabled={isSubmitting} // Disable based on Formik's isSubmitting
                  type="submit"
                  className="w-full bg-blue-500 text-white p-2 sm:p-3 rounded-md text-sm sm:text-base hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  {isSubmitting ? "Verifying..." : "Verify OTP"}
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default Otp;
