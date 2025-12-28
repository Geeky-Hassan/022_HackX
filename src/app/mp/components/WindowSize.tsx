"use client";

import {useState, useEffect} from "react";

// Getting window size to hide and show sidebar;
export const useWindowSize = () => {
  const [screenWidth, setScreenWidth] = useState(320);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleReload = () => {
        // Get the screen width
        const newScreenWidth = window.innerWidth;
        setScreenWidth(newScreenWidth);
      };

      // Attach the event listener to the window for resizing
      window.addEventListener("reload", handleReload);

      // Call the handleResize function once to get the initial screen width
      handleReload();
      // Cleanup the event listener when the component is unmounted

      return () => {
        window.removeEventListener("reload", handleReload);
      };
    }
  }, []);
  return screenWidth;
};
