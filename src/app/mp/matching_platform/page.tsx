// ---------------------
// Imports
// ---------------------
import {Metadata} from "next";
import {Toaster} from "react-hot-toast";
import FriendRadar from "./components/FriendRadar";
// import SearchRecommendedPeople from "./components/SearchPeople";
import RecommendedPeople from "./components/Recommended";

// ---------------------
// Interest page details
// ---------------------
export const metadata: Metadata = {
  title: "Student Matching Platform | MyPath AI",
  description: "Discover and engage with your friends, mentors, and community members.",
  icons: "/Logo/logo.svg",
};

// ---------------------
// Interest code starts here
// ---------------------
export default function SMP() {
  return (
    <>
      <div className="p-6 pt-12 h-fit xl:h-screen bg-white dark:bg-dark-custom-dark-blue mb-10 lg:mb-20 xl:mb-40">
        <FriendRadar />
        {/* 
        // ---------------------
        // Search bar 
        // ---------------------
        */}
        <div className="hr border-[0.5px] border-light-light-white dark:border-dark-button-blue my-5" />
        <div className="space-y-5">
          {/* <SearchRecommendedPeople /> */}
          <RecommendedPeople />
        </div>
      </div>
      <Toaster />
    </>
  );
}
