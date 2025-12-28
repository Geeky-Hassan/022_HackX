// -----------------------
// Imports
// -----------------------
import {Metadata} from "next";
import PricingComponent from "./components/Pricing";

// -----------------------
// Metadata
// -----------------------
export const metadata: Metadata = {
  title: "Pricing | MyPath AI",
  description:
    "Discover competitive pricing for MyPath AI's suite of tools designed to support students from Grade 9 to PhD. Our offerings include a Personalized Learning Assistant, Mental Wellness Resources, Accommodation Details, and Career-Building Features, all aimed at enhancing your educational journey and ensuring your success.",
  icons: "/Logo/logo.svg",
};

export default function Pricing() {
  return <PricingComponent />;
}
