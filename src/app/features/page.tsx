// ------------------------
// Imports
// ------------------------
import {Metadata} from "next";
import AllFeature from "@/components/AllFeature";

// ------------------------
// Page details
// ------------------------
export const metadata: Metadata = {
  title: "Features | MyPath AI",
  description:
    "Our AI-powered tools, including Personalized Learning Assistant, Mental Wellness Resources, Accommodation Details, and Career-Building Features, help students from Grade 9 to PhD succeed at their educational journey.",
  icons: "/Logo/logo.svg",
};

// ------------------------
// Main Code starts here
// ------------------------
export default function Feature() {
  return (
    <>
      <AllFeature />
    </>
  );
}
