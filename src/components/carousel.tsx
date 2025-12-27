"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import Button from "./Button/button";
import {motion, AnimatePresence} from "framer-motion";
import {slider} from "@/data/constants";

const Carousel = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTabActive, setIsTabActive] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentSlide = slider[currentSlideIndex];

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    let autoplayInterval: NodeJS.Timeout | null = null;

    const autoplay = () => {
      if (!isHovered && isTabActive) {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slider.length);
          setIsAnimating(false);
        }, 250); // Animation duration
      }
    };

    const startAutoplay = () => {
      autoplayInterval = setInterval(autoplay, 4000); // Change subject every 1.5 seconds
    };

    if (isTabActive) {
      startAutoplay();
    }

    return () => {
      if (autoplayInterval) clearInterval(autoplayInterval);
    };
  }, [isHovered, isTabActive]);

  // Base animation for shooting from bottom
  const createShootingAnimation = (index: any) => ({
    hidden: {
      opacity: 0,
      y: 150,
      scale: 0.3,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 150,
        duration: 0.7,
        // Random delay for each item
        delay: 0.2 + index * 0.1 + Math.random() * 0.3,
      },
    },
  });

  return (
    <div
      className="relative overflow-hidden h-full md:px-5 px-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2 gap-5 items-start">
            {/* Text Section */}
            <div className="md:space-y-10 space-y-5 mt-10 md:p-4 p-2 md:py-16">
              <div className="space-y-5">
                <h1 className="md:text-6xl text-4xl font-medium text-white relative overflow-hidden md:text-wrap h-fit pb-2 ">
                  Struggling with
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentSlideIndex}
                      initial={{y: -50, opacity: 0}}
                      animate={{y: 0, opacity: 1}}
                      exit={{y: 50, opacity: 0}}
                      transition={{duration: 0.5}}
                      className="inline-block ml-3"
                    >
                      {currentSlide.key}?
                    </motion.span>
                  </AnimatePresence>
                  <br />
                </h1>
                <span className="md:text-6xl text-4xl font-medium text-white">
                  Koi nahi, we got you!
                </span>
                <p className="text-white text-xl font-light">
                  Experience personalized AI tutoring with interactive lessons, real-time quizzes,
                  and dynamic visualizations to boost your understanding.
                </p>
              </div>
              <Button title={currentSlide.buttonText} place={"Carousel"} />
            </div>

            {/* Image Section with Random Floating Animation */}
            <div className="flex items-end self-end justify-end h-full">
              <div className="flex gap-0">
                {currentSlide.images.map((imageSrc, imgIndex) => {
                  const shootingAnimation = createShootingAnimation(imgIndex);

                  return (
                    <motion.div
                      key={`image-${currentSlideIndex}-${imgIndex}`}
                      initial="hidden"
                      animate="visible"
                      variants={shootingAnimation}
                      className="relative"
                    >
                      {/* Image with custom floating animation */}
                      <motion.div className="relative">
                        <Image
                          src={imageSrc}
                          alt={`Carousel Image ${imgIndex + 1}`}
                          width={100}
                          height={100}
                          className="size-64 object-contain"
                          priority={false}
                        />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
