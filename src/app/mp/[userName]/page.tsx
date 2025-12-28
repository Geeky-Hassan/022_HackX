// ------------------------
// Imports
// ------------------------
import { Metadata } from "next";
import ProfileSettings from "./components/ContentArea";
import ProfileLayout from "../components/global/Profile/ProfileLayout";

// ------------------------
// User profile details
// ------------------------
export const metadata: Metadata = {
  title: "User Profile | MyPath AI",
  description: "View and update your personal information.",
  icons: "/Logo/logo.svg",
};

// ------------------------
// User profile code starts here
// ------------------------
export default function UserProfile() {
  return (
    <ProfileLayout>
      <ProfileSettings />
    </ProfileLayout>
  );
}
