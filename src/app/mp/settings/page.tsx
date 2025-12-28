// ----------------------
// Imports
// ----------------------
import { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import ProfileLayout from "../components/global/Profile/ProfileLayout";
import SettingsContentArea from "./components/SettingsContentArea";

// ----------------------
// Setting details
// ----------------------
export const metadata: Metadata = {
  title: "Settings | MyPath AI",
  description: "View and update your settings.",
  icons: "/Logo/logo.svg",
};

// ----------------------
// Setting code starts here
// ----------------------
export default function Settings() {
  return (
    <ProfileLayout>
      <SettingsContentArea />
      <Toaster />
    </ProfileLayout>
  );
}
