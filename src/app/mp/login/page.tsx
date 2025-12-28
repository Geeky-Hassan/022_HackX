// -----------------------
// Imports
// -----------------------
import {Metadata} from "next";
import RegloComponent from "../components/Reglo";
import {Toaster} from "react-hot-toast";

// -----------------------
// MP page details
// -----------------------
export const metadata: Metadata = {
  title: "Student Login | MyPath AI",
  description:
    "Join MyPath AI today and unlock the power of AI-powered tools for your educational journey and career.",
  icons: "/Logo/logo.svg",
};

// -----------------------
// MyPath Starts Here
// -----------------------
export default function MP() {
  return (
    <>
      <RegloComponent />
      <Toaster />
    </>
  );
}
