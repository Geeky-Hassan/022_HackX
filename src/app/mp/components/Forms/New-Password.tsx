"use client";
import {useEffect, useState} from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import {EyeClosedIcon, EyeIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import {useSearchParams} from "next/navigation";
import {newPasswordHandler} from "../../mpHandler/forgotPasswordHandler";
import Image from "next/image";
import Link from "next/link";
const passwordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .matches(/^[^+]*$/, "Email must not contain '+'")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]{8,}$/,
      "Must include uppercase, lowercase, number, and special character",
    )
    .required("Password is required"),
});

const NewPasswordForm = () => {
  const token = useSearchParams().get("token");

  // const {email} = stateStore();
  const [email, setEmail] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  useEffect(() => {
    // Get email from localStorage and update state
    const storedEmail = localStorage.getItem("email");

    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);
  if (!email) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center gap-6 bg-light-white dark:bg-custom-dark-blue transition-colors duration-300 p-4">
        {/* Logo with subtle hover effect */}
        <div className="p-3 rounded-full bg-light-blue dark:bg-custom-blue-stroke transition-all duration-300 hover:scale-105">
          <Link href="/mp">
            <Image
              src="/Logo/logo.svg"
              width={60}
              height={60}
              alt="MyPath logo"
              className="hover:opacity-90 transition-opacity"
            />
          </Link>
        </div>

        {/* Message with animated underline */}
        <div className="relative">
          <h2 className="text-2xl md:text-3xl font-medium text-text-blue dark:text-logo-primary text-center">
            You haven&apos;t received an email yet!
          </h2>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-text-blue dark:bg-logo-primary opacity-70 animate-pulse"></div>
        </div>

        {/* Optional decorative elements */}
        <div className="absolute bottom-8 text-sm text-light-black dark:text-secondary-text opacity-70">
          Need help?{" "}
          <Link
            href="mailto:info2mypath@gmail.com"
            className="text-dark-logo-primary hover:underline"
          >
            Contact support
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <div className="newPassword">
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-8 space-y-6">
            {/* Logo */}
            <div className="img grid justify-center">
              <Link href={"/mp"}>
                <Image src={"/Logo/logo.svg"} width={50} height={50} alt={"MyPath logo"} />
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">New Password</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Create a strong, secure password
              </p>
            </div>

            <Formik
              initialValues={{email: email, password: "", token: token}}
              validationSchema={passwordSchema}
              onSubmit={async (values, {setSubmitting}) => {
                setSubmitting(true);
                try {
                  const resp = await newPasswordHandler(values);

                  if (resp?.status === 200) {
                    alert("Password updated successfully! Please sign in.");
                    router.push("/mp/login");
                  } else if (resp?.status === 404) {
                    setError(resp?.message || "An error occurred");
                  } else {
                    setError("An error occurred. Please try again.");
                  }
                } catch (error: any) {
                  setError(`An error occurred while updating the password. ${error}`);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({isSubmitting, errors, touched}) => (
                <Form className="space-y-6">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all ${
                          errors.password && touched.password
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-800"
                        } dark:bg-gray-700 dark:text-white`}
                        placeholder="Enter your new password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeClosedIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="mt-1 text-sm text-red-600 dark:text-red-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
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
                        Updating...
                      </span>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </Form>
              )}
            </Formik>

            {error && (
              <div
                className={`px-8 py-4 text-sm bg-rose-50 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-t border-rose-200 dark:border-rose-800`}
              >
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 mr-2 text-rose-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>

                  {error}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default NewPasswordForm;
