"use client";

import { useState } from "react";
import Link from "next/link";
import { NavItems } from "@/data/constants";
import { Squash as Hamburger } from "hamburger-react";
import { AnimatePresence, motion } from "framer-motion";

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex md:hidden ">
      <div className=" w-full">
        <div className="flex justify-end items-center">
          <div className="flex items-center text-black dark:text-white">
            <Hamburger size={18} color="blue" toggled={isOpen} toggle={setIsOpen} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="lg:hidden bg-white shadow text-logo-primary absolute top-full left-1 w-[98vw] mx-auto rounded-lg shadow-lg "
          >
            <div className="px-4 pt-3 pb-4 space-y-2 sm:px-4">
              {NavItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`block px-4 py-2.5 rounded-lg text-base font-medium text-logo-primary hover:bg-gray-50 active:text-blue-500 transition-colors`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default MobileNavbar;
