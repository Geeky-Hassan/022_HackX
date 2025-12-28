// ----------------------------
// Imports
// ----------------------------
"use client";
import {useRouter} from "next/navigation";
import {Formik, Form, Field} from "formik";
import {Eye, EyeOff, Mail, Lock, ChevronLeft, AlertCircle, X} from "lucide-react";
import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import stateStore from "@/store/zuStore";
import {loginUser} from "@/services/auth";
import type {LoginRequest} from "@/services/auth/interfaces";
import GoogleAuth from "../../components/global/GoogleAuth";
import {useToast} from "../../components/Toast";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
// ----------------------------
// Login code starts here
// ----------------------------
const Login = () => {
  // ----------------------------
  // Setting vars
  // ----------------------------
  const [showPassword, setShowPassword] = useState(false);
  const setReglo = stateStore((state) => state.setReglo);
  const router = useRouter();
  const {showToast} = useToast();

  // ----------------------------
  // React Query mutation for login
  // ----------------------------
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => loginUser(credentials),
    onSuccess: (response) => {
      if (response.status === 200 && response.data) {
        // Handle successful login - store token and update state
        if (response.data.token) {
          const {setUser, setUserName} = stateStore.getState();
          // Store token in cookies
          Cookies.set("serviceToken", response.data.token);

          // Update user state
          if (response.data.user) {
            setUser(response.data.user);
            setUserName(response.data.user.name);
          }

          // Emit login success event for other components to listen
          window.dispatchEvent(new CustomEvent("login-success"));
        }

        showToast({
          message: "Let's Learn!",
          status: "success",
          duration: 3000,
          position: "bottom-right",
        });
        router.push("/mp/chatbot");
      }
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      showToast({
        message: error.message || "An unexpected error occurred",
        status: "error",
        duration: 3000,
        position: "bottom-right",
      });
    },
  });

  // ----------------------------
  // Handle specific error cases from API response
  // ----------------------------
  const handleLoginResponse = (response: any, email: string) => {
    if (response.status === 401) {
      showToast({
        message: response.message || "Incorrect email or password!",
        status: "error",
        duration: 3000,
        position: "bottom-right",
      });
    } else if (response.status === 403) {
      // Email not verified - store email for OTP verification
      const {setEmail} = stateStore.getState();
      setEmail(email);

      showToast({
        message: response.message || "Please verify your email!",
        status: "error",
        duration: 3000,
        position: "bottom-right",
      });
      router.push("/mp/login/otp");
    } else {
      showToast({
        message: response.message || "Login failed",
        status: "error",
        duration: 3000,
        position: "bottom-right",
      });
    }
  };
  return (
    <div className="flex gap-10 lg:gap-2 md:mx-2 mx-4 lg:mx-0 h-screen items-center justify-between bg-white text-black">
      <div className="img hidden lg:flex">
        <div className="box w-[51vw] h-screen flex items-center justify-center">
          <div className="relative w-[70%] h-[70%]">
            <Image
              src={"/assets/images/auth/login.png"}
              alt="login"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
      <div className="login-form w-full max-w-[500px] lg:max-w-[600px] xl:max-w-[700px] mx-auto md:pr-4 lg:mx-5 xl:mx-auto">
        <div className="details my-4">
          <Link
            href={"/"}
            className="my-2 text-[#1D68FF] text-sm md:text-base flex items-center hover:underline"
          >
            <ChevronLeft className="size-5 md:size-6" />
            &nbsp;Go to Home
          </Link>
          <h1 className="md:text-3xl text-2xl font-medium text-[#1D68FF] my-2">Welcome back!</h1>
          <p className="text-sm text-dark-custom-dark-blue dark:text-[#1D68FF]/80">
            Glad to have you back. Please login to continue your learning path!
          </p>
        </div>

        <Formik
          initialValues={{email: "", password: "", rememberMe: false}}
          onSubmit={async (values) => {
            try {
              const response = await loginMutation.mutateAsync({
                email: values.email,
                password: values.password,
              });

              // Handle non-success status codes that don't throw errors
              if (response.status !== 200) {
                handleLoginResponse(response, values.email);
              }
            } catch (error) {
              // Error handling is done in the mutation's onError callback
              console.error("Form submission error:", error);
            }
          }}
        >
          {() => (
            <Form className="space-y-4 reglo-form lg:my-5">
              {/* Error Message */}
              {loginMutation.isError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 shadow-sm">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-red-700 font-medium">
                      {loginMutation.error?.message || "Login failed. Please try again."}
                    </p>
                  </div>
                  <button
                    onClick={() => loginMutation.reset()}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Dismiss error"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="relative">
                <Field
                  type="email"
                  name="email"
                  placeholder="info@mypath.one"
                  className="reglo-input-field"
                  required
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-dark-custom-blue dark:text-[#1D68FF]" />
              </div>

              <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••"
                  className="reglo-input-field"
                  required
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-dark-custom-blue dark:text-[#1D68FF]" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400"
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5 text-text-blue" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-text-blue" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-end">
                {/* <label className="flex items-center">
                  <Field type="checkbox" name="rememberMe" className="mr-2" />
                  <span className="text-sm text-gray-600">Keep me sign in</span>
                </label> */}
                <Link
                  href="/mp/login/forgot_password"
                  className="text-sm text-[#1D68FF] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className={`w-full bg-blue-600 text-white py-2 rounded-md transition duration-300 ${
                  loginMutation.isPending && "bg-gray-500 cursor-not-allowed"
                }`}
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>

        {/* <GoogleAuth title={"Log in"} /> */}

        <p className="text-center text-sm mt-4 text-dark-custom-dark-blue lg:mt-5 xl:-ml-20">
          Don&apos;t have an account?{" "}
          <button
            onClick={setReglo}
            className="text-dark-custom-dark-blue dark:text-[#1D68FF] font-medium hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
