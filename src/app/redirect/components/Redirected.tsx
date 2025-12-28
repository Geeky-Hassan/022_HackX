"use client";
import Typewriter from "typewriter-effect";
import {Box} from "@mui/material";

const Redirected = () => {
  return (
    <Box
      sx={{
        fontSize: {
          xs: "20px", // Small screens (mobile)
          sm: "30px", // Medium screens (tablet)
          md: "40px", // Large screens (small desktop)
          lg: "80px", // Extra large screens (desktop)
        },
        color: "blue",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center", // Center text for better mobile view
        padding: "0 10px", // Add padding for smaller screens
      }}
    >
      <Typewriter
        onInit={(typewriter) => {
          typewriter.typeString("Coming Soon!").start();
        }}
      />
    </Box>
  );
};
export default Redirected;
