"use client";
import Typewriter from "typewriter-effect";
import {Box} from "@mui/material";

const TypeWrite = () => {
  return (
    <Box
      sx={{
        fontSize: {
          xs: "12px", // Small screens (mobile)
          sm: "16px", // Medium screens (tablet)
          md: "18px", // Large screens (small desktop)
          lg: "30px", // Extra large screens (desktop)
        },
        color: "blue",
        display: "flex",
        marginTop: "20px",
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
export default TypeWrite;
