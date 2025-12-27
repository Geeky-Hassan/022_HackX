"use client";

import {useEffect, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {cards} from "@/data/constants";
import Link from "next/link";

const Features = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % cards.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentCard = cards[currentCardIndex];

  return (
    <section className="w-full bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20">
        {/* Left: Text */}
        <div className="w-full md:w-1/2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCardIndex}
              initial={{opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -10}}
              transition={{duration: 0.4}}
              className="space-y-6"
            >
              <h1 className="text-2xl md:text-3xl font-semibold text-[#000]">
                {currentCard.title}
              </h1>
              <p className="text-[#000] text-base md:text-lg">{currentCard.description}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-6 relative w-fit group">
            <Link href="/mp">
              <button
                onClick={() => (window.location.href = "/mp")}
                className="relative z-10 overflow-hidden rounded-full border border-[#1D68FF] bg-white px-6 py-2 text-base md:text-lg font-semibold text-[#1D68FF] transition-colors duration-300 group-hover:text-white"
              >
                <span
                  className="absolute inset-0 z-0 w-0 transition-all duration-300 ease-out group-hover:w-full rounded-full"
                  style={{
                    background: "linear-gradient(180deg, #113E99, #1D68FF)",
                  }}
                ></span>
                <span className="relative z-10">Get Started</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Right: Static Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="/assets/images/hero/LP-Cardimage.png"
            alt="Card illustration"
            className="max-w-[320px] md:max-w-[400px] object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
