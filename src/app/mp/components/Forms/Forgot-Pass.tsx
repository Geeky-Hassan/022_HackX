"use client";
import { useEffect, useState } from "react";
import { CheckCircle, ChevronLeft } from "lucide-react";
import ForgotEmail from "./Forgot-Email";
import Link from "next/link";
import Image from "next/image";
import stateStore from "@/store/zuStore";
import { forgotPasswordEmail } from "../../mpHandler/forgotPasswordHandler";
import { useToast } from "../Toast";

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [timer, setTimer] = useState<number>(0);
  const [resend, setResend] = useState<boolean>(false);
  const { email } = stateStore();
  const { showToast } = useToast();

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

  const handleResend = async () => {
    try {
      setResend(true);
      const res = await forgotPasswordEmail(email);
      showToast({
        message: res.data.message,
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

  return (
    <div className="flex gap-10 lg:gap-2 mx-2 lg:mx-0 h-screen items-center justify-between bg-white text-black">
      {/* Left Image side */}
      <div className="img hidden lg:flex">
        <div className="box w-[51vw] h-screen flex items-center justify-center">
          <div className="relative w-[70%] h-[70%]">
            <Image
              src={"/assets/images/auth/login.png"}
              alt="Forgot Password"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Right Form side */}
      <div className="login-form w-full max-w-[500px] lg:max-w-[600px] xl:max-w-[700px] mx-auto lg:mx-5 xl:mx-auto">
        <div className="details my-4">
          <Link href={"/"} className="my-2 text-[#1D68FF] flex items-center hover:underline">
            <ChevronLeft /> &nbsp;Go to Home
          </Link>
        </div>

        {/* Form or Submitted state */}
        {!isSubmitted ? (
          <ForgotEmail setIsSubmitted={setIsSubmitted} setSubmittedEmail={setSubmittedEmail} />
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all animate-fade-in-up">
            <div className="p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
              <p className="text-gray-600 mb-6">
                We&apos;ve sent a password reset link to
                <br />
                <span className="font-medium text-gray-900">{submittedEmail}</span>
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Back to reset password
                </button>
                <p className="text-sm text-gray-500">
                  Didn&apos;t receive the email? Check your spam folder or{" "}
                  <button
                    onClick={handleResend}
                    className={`${resend ? "text-gray-500" : "text-blue-500"} hover:underline text-sm `}
                    disabled={resend}
                  >
                    Try again&nbsp;&nbsp;
                    <span className="text-dark-custom-dark-blue">
                      {timer < 30 && resend ? timer + "s" : ""}
                    </span>
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-sm mt-8 text-dark-custom-dark-blue ">
          Need help?{" "}
          <Link
            href="mailto:info2mypath@gmail.com"
            className="text-[#1D68FF] hover:text-blue-800 font-medium"
          >
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
