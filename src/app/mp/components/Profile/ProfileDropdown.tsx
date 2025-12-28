"use client";

import {useState, useRef, useEffect} from "react";
import Link from "next/link";
import {User2Icon, LogOut, ExternalLink} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";
import {generateColor, getInitials, profileDropdownLinks} from "../global/constants";
import stateStore from "@/store/zuStore";
import Image from "next/image";
import {logout} from "@/services/auth";

type DropdownPlacement =
  | "top"
  | "top-left"
  | "top-right"
  | "bottom"
  | "bottom-right"
  | "bottom-left"
  | "right"
  | "left";

type ProfileDropdownProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  placement?: DropdownPlacement;
};

const ProfileDropdown = ({placement = "bottom-right", open, setOpen}: ProfileDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const {user, userName} = stateStore();

  const handleDropdown = () => setOpen(!open);
  const handleLogout = () => {
    logout();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle escape key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    if (open) {
      document.addEventListener("keydown", handleEscKey);
      return () => document.removeEventListener("keydown", handleEscKey);
    }
  }, [open]);

  const avatarColor = generateColor(userName);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      handleDropdown();
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Avatar Button */}
      <div
        ref={avatarRef}
        className="relative flex items-center gap-2 cursor-pointer group"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User menu"
        tabIndex={0}
        role="button"
        onKeyDown={handleKeyDown}
      >
        {/* Avatar Container */}
        <div className="relative">
          <div
            className={`
              size-10 rounded-full flex items-center justify-center
              bg-white border-2 border-gray-200 shadow-sm
              hover:shadow-md hover:border-blue-300
              transition-all duration-200 ease-in-out
              ${open ? "ring-2 ring-blue-500 ring-offset-2" : ""}
            `}
          >
            {user?.img ? (
              <Image
                width={40}
                height={40}
                src={user.img}
                alt={userName}
                className="size-full rounded-full object-cover"
              />
            ) : (
              <div
                className={`size-full rounded-full flex items-center justify-center ${avatarColor}`}
              >
                <span className="font-medium text-sm ">{getInitials(userName)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={dropdownRef}
            initial={
              placement.startsWith("top")
                ? {opacity: 0, y: -10, scale: 0.95}
                : placement.startsWith("bottom")
                  ? {opacity: 0, y: 10, scale: 0.95}
                  : placement === "left"
                    ? {opacity: 0, x: -10, scale: 0.95}
                    : {opacity: 0, x: 10, scale: 0.95}
            }
            animate={{opacity: 1, x: 0, y: 0, scale: 1}}
            exit={
              placement.startsWith("top")
                ? {opacity: 0, y: -10, scale: 0.95}
                : placement.startsWith("bottom")
                  ? {opacity: 0, y: 10, scale: 0.95}
                  : placement === "left"
                    ? {opacity: 0, x: -10, scale: 0.95}
                    : {opacity: 0, x: 10, scale: 0.95}
            }
            transition={{duration: 0.15, ease: "easeOut"}}
            className={[
              "absolute z-[70] w-44",
              // Positioning relative to avatar
              placement === "top" && "bottom-full left-1/2 -translate-x-1/2 mb-2 origin-bottom",
              placement === "top-right" && "bottom-full -right-36 mb-2 origin-bottom-right",
              placement === "top-left" && "bottom-full left-0 mb-2 origin-bottom-left",
              placement === "bottom" && "top-full left-1/2 -translate-x-1/2 mt-2 origin-top",
              placement === "bottom-right" && "top-full right-0 mt-2 origin-top-right",
              placement === "bottom-left" && "top-full left-0 mt-2 origin-top-left",
              placement === "right" && "left-full top-1/2 -translate-y-1/2 ml-2 origin-left",
              placement === "left" && "right-full top-1/2 -translate-y-1/2 mr-2 origin-right",
            ]
              .filter(Boolean)
              .join(" ")}
            role="menu"
            aria-orientation="vertical"
          >
            <div className="rounded-xl shadow-lg overflow-hidden bg-white border border-gray-200">
              {/* Navigation Links */}
              <div className="py-2">
                {profileDropdownLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="group flex items-center px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    {link.icon}
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                      {link.title}
                    </span>
                  </Link>
                ))}

                {/* Admin Panel Link */}
                {user?.role === "admin" && (
                  <Link
                    href="https://admin-mypath.vercel.app/signin"
                    target="_blank"
                    className="group flex items-center px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    <User2Icon className="mr-3 h-5 w-5 text-gray-500 group-hover:text-blue-500 transition-colors" />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                      Admin Panel
                    </span>
                    <ExternalLink className="ml-auto h-3.5 w-3.5 text-gray-400" />
                  </Link>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

              {/* Logout Button */}
              <div className="py-1.5">
                <button
                  onClick={handleLogout}
                  className="group flex w-full items-center px-4 py-2.5 text-sm hover:bg-red-50 transition-colors"
                  role="menuitem"
                >
                  <LogOut className="mr-3 h-5 w-5 text-gray-500 group-hover:text-red-500 transition-colors" />
                  <span className="text-gray-700 group-hover:text-red-600 transition-colors">
                    Logout
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
