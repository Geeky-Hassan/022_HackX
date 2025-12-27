"use client";

import {motion} from "framer-motion";
import {useEffect, useState} from "react";
import {Box} from "@mui/material";
import TeamCard from "@/app/team/TeamCard";
import {getTeamData} from "@/data/sanityQueries";

// Define animation variants
const containerVariants = {
  hidden: {opacity: 0},
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: {opacity: 0, y: 20},
  show: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.4},
  },
};

const Team = () => {
  const [teamData, setTeamData] = useState<any[]>([]);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const resp = await getTeamData();

        setTeamData(resp); // set the response directly
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };
    fetchTeamData();
  }, []);

  return (
    <div className="md:p-10 p-5 mt-10 flex flex-col gap-1">
      {/* Title and Subtitle */}
      <Box>
        <Box sx={styles.Title} className="font-promixa">
          Our Core Team
        </Box>

        <Box sx={styles.mainHeading}>Our Core Team</Box>

        <Box sx={styles.subTitle} className="font-promixa">
          At our core, there is no Iron Man&apos;s nuclear reactor. These are the developers &
          designers whose hard work of day & night drives this AI Vision.
        </Box>
      </Box>

      {/* Grid container with motion.div */}
      <motion.div
        className="z-0 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 
                   md:gap-y-20 xl:gap-x-16 lg:gap-x-16 md:gap-x-10 gap-y-12 
                   md:mt-20 mt-10 place-items-center"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {teamData.map((member, index) => (
          <motion.div key={index} variants={cardVariants}>
            <TeamCard {...member} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Team;

const styles = {
  container: {
    marginTop: 0,
    marginBottom: "25px",
    px: "2px",
  },
  Title: {
    color: "#000000",
    fontWeight: 400,
    fontSize: "14px",
    letterSpacing: "4px",
    textTransform: "uppercase",
    lineHeight: "20px",
    fontFamily: "var(--font-promixa)",
    textAlign: "center",
  },
  mainHeading: {
    fontSize: "48px",
    fontWeight: 600,
    color: "#000000",
    letterSpacing: "-1px",
    lineHeight: "58px",
    mt: 3,
    textAlign: "center",
  },
  subTitle: {
    fontSize: "20px",
    fontWeight: 300,
    color: "gray",
    textAlign: "center",
    fontFamily: "var(--font-promixa)",
    mt: 2,
  },
  memberName: {
    fontSize: "22px",
    fontWeight: 600,
    color: "#fff",
  },
  memberRole: {
    fontSize: "18px",
    color: "#ccc",
    mt: 1,
  },
};
