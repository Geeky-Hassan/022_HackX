"use client";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import { useToast } from "../Toast";
import Link from "next/link";
import { usePathname } from "next/navigation";
import stateStore from "@/store/zuStore";
import { resendOTP, validateOTP } from "../../mpHandler/regloHandler";
const Otp = ({ showOTP, setNewPasswordForm }: { showOTP?: any; setNewPasswordForm?: any }) => {
  const { email } = stateStore();
  const [timer, setTimer] = useState<number>(0);
  const [resend, setResend] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const route = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace" && index > 0 && !event.currentTarget.value) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>, setFieldValue: any) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").trim();
    if (/^\d{6}$/.test(pasteData)) {
      const otpArray = pasteData.split("");
      otpArray.forEach((digit, index) => {
        if (index < 6) {
          setFieldValue(`otp[${index}]`, digit);
          if (index < 5) {
            inputRefs.current[index + 1]?.focus();
          }
        }
      });
    }
  };

  const handleResend = async () => {
    try {
      setResend(true);
      const res = await resendOTP(email);
      showToast({
        message: res.message,
        status: "success",
        duration: 3000,
      });
    } catch (error: any) {
      showToast({
        message: error,
        status: "error",
        duration: 6000,
      });
    }
  };

  useEffect(() => {
    const countdown = () => {
      if (timer < 30 && resend) {
        setTimer(timer + 1);
      } else {
        setResend(false);
        setTimer(0);
      }
    };
    const interval = setInterval(countdown, 1000);
    return () => clearInterval(interval);
  });

  if (email.length <= 0)
    return (
      <div className="text-black dark:text-white flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-3xl mb-4">Please Register First</h1>
        <Link
          className="text-blue-500 hover:text-blue-700 text-lg font-medium transition-colors"
          href={"/signup"}
        >
          Register
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 hover:shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center text-white">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M8 11l3 3 5-5" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight">Verification Code</h2>
          <p className="mt-1 text-sm font-medium text-blue-100">
            We&apos;ve sent a code to {email.substring(0, 3)}***
            {email.substring(email.indexOf("@"))}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <Formik
            initialValues={{ otp: ["", "", "", "", "", ""] }}
            onSubmit={async (values) => {
              setSubmitting(true);
              const value = {
                email: email,
                otp: values.otp.join(""),
              };
              try {
                const resp = await validateOTP(value);
                if (pathname.includes("forgot")) {
                  if (resp.status === 200) {
                    showOTP(false);
                    setNewPasswordForm(true);
                  } else {
                    showToast({
                      message: resp.message,
                      status: "error",
                      duration: 6000,
                    });
                  }
                } else {
                  if (resp.status === 200) {
                    showToast({
                      message: resp.message,
                      status: "success",
                      duration: 3000,
                    });
                    route.push("/mp/login");
                  }
                }
              } catch (error: any) {
                showToast({
                  message: error,
                  status: "error",
                  duration: 3000,
                });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ setFieldValue }) => (
              <Form>
                <div className="mb-8" onPaste={(e) => handlePaste(e, setFieldValue)}>
                  <div className="flex justify-center gap-2 sm:gap-3 md:gap-4">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <div key={index} className="relative">
                        <Field
                          name={`otp[${index}]`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          className="w-11 h-14 sm:w-12 sm:h-16 md:w-14 md:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-sm"
                          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                            handleKeyDown(e, index)
                          }
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value;
                            if (/^\d?$/.test(value)) {
                              setFieldValue(`otp[${index}]`, value);
                              if (value && index < 5) {
                                inputRefs.current[index + 1]?.focus();
                              }
                            }
                          }}
                          innerRef={(el: HTMLInputElement) => (inputRefs.current[index] = el)}
                        />
                        {index < 5 && (
                          <div className="hidden sm:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-gray-300 dark:text-gray-600">
                            •
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                    Paste your 6-digit OTP above
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-3 sm:space-y-0">
                  <div className="flex items-center">
                    <button
                      type="button"
                      className={`flex items-center ${resend
                          ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        } text-sm font-medium transition-colors duration-200`}
                      onClick={handleResend}
                      disabled={resend}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
                      </svg>
                      Resend Code
                    </button>
                  </div>

                  {resend && (
                    <div className="flex items-center">
                      <div className="w-20 h-5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
                          style={{ width: `${(timer / 30) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 min-w-[30px]">
                        {timer}s
                      </span>
                    </div>
                  )}
                </div>

                <button
                  disabled={submitting}
                  type="submit"
                  className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl text-base font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 transition-all duration-200 shadow-md"
                >
                  <span className="absolute inset-y-0 left-0 flex w-0 items-center justify-center bg-white/20 transition-all duration-300 group-hover:w-full"></span>
                  <span className="relative flex items-center justify-center">
                    {submitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      <>Verify Code</>
                    )}
                  </span>
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Didn&apos;t receive the code? Check your spam folder
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
