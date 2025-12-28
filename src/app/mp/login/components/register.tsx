"use client";
// -------------------------------
// Imports
// -------------------------------
import {useToast} from "../../components/Toast";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User2Icon,
  LockKeyhole,
  ChevronLeft,
  AlertCircle,
  X,
} from "lucide-react";
import stateStore from "@/store/zuStore";
import {UserRegisterHandler} from "../../mpHandler/regloHandler";
import * as Yup from "yup";
import Link from "next/link";
import Image from "next/image";
import {getUserLocation} from "@/data/constants";
import GoogleAuth from "../../components/global/GoogleAuth";

// -------------------------------
// Register code starts here
// -------------------------------
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>("");
  const [persmission, setPermission] = useState(false);
  const setReglo = stateStore((state) => state.setReglo);

  const route = useRouter();
  const {showToast} = useToast();

  const registerValidation = Yup.object().shape({
    ipAddress: Yup.string(),
    country: Yup.string(),
    city: Yup.string(),
    name: Yup.string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must not exceed 50 characters")
      .matches(/^[a-zA-Z\s]*$/, "Name must only contain alphabets and spaces."),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    gender: Yup.string().required("Gender is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!#%*?&.]{8,}$/,
        "Password must contain uppercase, lowercase, number, and special character.",
      ),
    cpassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), ""], "Passwords must match"),
  });

  return (
    <div className="flex flex-row-reverse gap-10 lg:gap-2 md:pl-4 md:mx-2 mx-4 h-screen items-center justify-between bg-white text-black">
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
      <div className="register-form mx-auto lg:mx-5 xl:mx-auto">
        <div className="details my-4">
          <Link
            href={"/"}
            className="my-2 text-blue-600 text-sm md:text-base flex items-center hover:underline"
          >
            <ChevronLeft className="size-5 md:size-6" />
            &nbsp;Go to Home
          </Link>
          <h1 className="md:text-3xl text-2xl font-medium text-[#1D68FF] my-2">
            Create an Account
          </h1>
          <p className="text-sm text-700 text-[#1D68FF]/80">
            Start your journey with smarter learning. Sign up and take the first step toward
            effortless understanding!
          </p>
        </div>
        <Formik
          initialValues={{
            email: "",
            password: "",
            cpassword: "",
            name: "",
            gender: "",
            rememberMe: false,
            ipAddress: "",
            country: "",
            city: "",
          }}
          validationSchema={registerValidation}
          onSubmit={async (values) => {
            setLoading(true);
            setMessage(""); // Clear any existing errors
            try {
              const res = await getUserLocation();

              values.ipAddress = res.ip;
              values.city = res.city;
              values.country = res.country;

              const resp = await UserRegisterHandler(values);

              if (resp.status == 200) {
                setMessage("Registration successful! Redirecting to OTP page...");
                route.push("/mp/login/otp");
              } else if (resp.status == 409) {
                setMessage("Email already exists. Please try another one.");
              }
            } catch (error: any) {
              console.log(`error: ${JSON.stringify(error)}`);
              setMessage(error.message || "An error occurred");
            } finally {
              setLoading(false);
            }
          }}
        >
          {() => (
            <Form className="space-y-4 lg:my-5 reglo-form">
              {/* Error Display */}
              {message && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 shadow-sm">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-red-700 font-medium">{message}</p>
                  </div>
                  <button
                    onClick={() => setMessage("")}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Dismiss error"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Name */}
              <div className="relative">
                <Field
                  type="text"
                  name="name"
                  placeholder="Your full name here"
                  className="reglo-input-field"
                />
                <User2Icon className="absolute left-3 top-2.5 h-5 w-5 text-blue-600" />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Email */}
              <div className="relative">
                <Field
                  type="email"
                  name="email"
                  placeholder="info@mypath.one"
                  className="reglo-input-field"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-blue-600" />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Gender */}
              <div className="relative">
                <User2Icon className="absolute left-3 top-2.5 h-5 w-5 text-blue-600" />
                <Field as="select" name="gender" className="reglo-input-field">
                  <option value="" disabled>
                    Select a Gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Field>
                <ErrorMessage name="gender" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Password */}
              <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="reglo-input-field"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-blue-600" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5 text-blue-600" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-blue-600" />
                  )}
                </button>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="cpassword"
                  placeholder="••••••••"
                  className="reglo-input-field"
                />
                <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-blue-600" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5 text-blue-600" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-blue-600" />
                  )}
                </button>
                <ErrorMessage
                  name="cpassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={persmission}
                  onChange={(e) => setPermission(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="text-sm text-[#1D68FF]/80">
                  By using MyPath you agree to our{" "}
                  <Link href="/terms&Conditions" className="underline text-blue-600">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" className="underline text-blue-600">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!persmission || loading}
                className={`w-full bg-blue-600 text-white py-2 rounded-md transition duration-300 ${loading && "bg-gray-500"}`}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>
        {/* <GoogleAuth title={"Sign in"} /> */}

        <p className="mt-4 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <button onClick={setReglo} className="text-blue-600 font-medium hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
