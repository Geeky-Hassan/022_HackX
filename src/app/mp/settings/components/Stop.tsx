"use client";
// ----------------------
// Imports
// ----------------------
import {Suspense} from "react";
import {settings} from "../../components/global/constants";
import UserNavigation from "../../components/UserNavigate";
// import Billing from "./Billing";
import SupportForm from "./Support";
import {useSearchParams} from "next/navigation";

// ----------------------
// Top component of support
// ----------------------
const STopComponent = () => {
  const param = useSearchParams().get("get") || "";

  return (
    <>
      {/* 
        // ---------------------
        // User Navigation
        // ---------------------
      */}
      <div className="pt-20 mx-2 pb-2 flex border-b border-light-light-white dark:border-dark-custom-blue-stroke font-semibold text-lg">
        {settings.map((setting, index) => (
          <UserNavigation key={index} title={setting.title} />
        ))}
      </div>
      {/* 
        // ---------------------
        // Showing different components based on User navigation
        // ---------------------
      */}
      {param === "support" ? (
        <div className="support">
          <SupportForm />
        </div>
      ) : (
        // ) : param === "billing" ? (
        //   <div className="support">
        //     <Billing />
        //   </div>
        <div className="support">
          <SupportForm />
        </div>
      )}
    </>
  );
};

// ----------------------
// Top component of support code starts here
// ----------------------
const STop = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <STopComponent />
  </Suspense>
);

export default STop;
