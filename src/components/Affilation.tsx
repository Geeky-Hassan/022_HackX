import {Box} from "@mui/material";
import Image from "next/image";
import React from "react";

import {AboutHeroContent} from "@/data/constants";
import FadeInWhenVisible from "./Animation";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    mt: {xs: 10, sm: 0},
  },
  title: {
    fontSize: {sm: "48px", xs: "38px"},
    fontWeight: 600,
    color: "#fff",
    letterSpacing: "-1px",
    lineHeight: "58px",
    mt: 3,
    textAlign: "center",
    // px: 1.5,
  },
  logosContainer: {
    padding: "24px 0px",
    marginY: 5,
  },
  logosSide: {
    display: "flex",
    justifyContent: "center",
    gap: 2,
    flexWrap: "wrap",
  },
};

const Affilation = () => {
  const acheivement = AboutHeroContent.acheivement;

  return (
    <Box sx={styles.container}>
      <FadeInWhenVisible>
        <Box sx={styles.title}>{AboutHeroContent.title}</Box>
      </FadeInWhenVisible>
      <Box className="logos" sx={styles.logosContainer}>
        {Array(3)
          .fill("")
          .map((_, index) => (
            <Box className="logos-side" sx={styles.logosSide} key={index}>
              {acheivement.map((item) => (
                <Image key={item.id} src={item.image} alt={item.name} height={100} width={100} />
              ))}
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default Affilation;
