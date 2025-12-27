"use client";
import {ReactElement} from "react";
import {motion} from "framer-motion";

export default function FadeInWhenVisible({children}: {children: ReactElement}) {
  return (
    <motion.div
      initial={{opacity: 0, translateY: 200}}
      whileInView={{opacity: 1, translateY: 0}}
      transition={{duration: 0.4}}
      viewport={{once: true}} // Ensures the animation runs only once when the component enters the view
    >
      {children}
    </motion.div>
  );
}
