// -------------------------------
// Imports
// -------------------------------
import {Metadata} from "next";
import Otp from "../../components/Auth/OTP/Otp";
import {Toaster} from "react-hot-toast";

// -------------------------------
// OTP page details
// -------------------------------
export const metadata: Metadata = {
  title: "OTP | MyPath",
  description: "OTP page",
  icons: "/Logo/logo.svg",
};
// -------------------------------
// OTP code starts here
// -------------------------------
export default function OTP() {
  return (
    <>
      <Toaster />
      <Otp />
    </>
  );
}
