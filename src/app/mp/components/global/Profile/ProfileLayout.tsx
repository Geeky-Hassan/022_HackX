"use client";

// ------------------------
// Imports
// ------------------------
import {useState, ReactNode} from "react";
import {Menu} from "lucide-react";
import {usePathname} from "next/navigation";
import stateStore from "@/store/zuStore";
import Cookies from "js-cookie";
import {useChatbotStore} from "../../../store/chatbotStore";

// Component imports
import ProfileSidebar from "./ProfileSidebar";

// ------------------------
// Types
// ------------------------
interface ProfileLayoutProps {
  children: ReactNode;
}

// ------------------------
// Main Component
// ------------------------
const ProfileLayout = ({children}: ProfileLayoutProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const {user, userName} = stateStore();
  const {setFetchChat, setNewChat} = useChatbotStore();
  const pathname = usePathname();

  // Event Handlers
  const handleLogout = () => {
    Cookies.remove("serviceToken");
    setFetchChat(false);
    setNewChat(true);
    localStorage.clear();
    sessionStorage.clear();
    location.reload();
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="flex min-h-screen bg-back-white text-[#1a1a1a]">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleDrawer}
        className={`md:hidden ${isDrawerOpen && "hidden"} fixed z-50 mt-[5rem] ml-4 text-dark-text-hover`}
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <ProfileSidebar
        userName={userName || ""}
        isOpen={isDrawerOpen}
        currentPath={pathname}
        onClose={toggleDrawer}
        onLogout={handleLogout}
      />

      {/* Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleDrawer}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 md:px-10 px-4 py-10 flex bg-back-white flex-col items-center mt-[6rem] md:pl-10 ">
        <div className="w-full max-w-4xl">{children}</div>
      </main>
    </div>
  );
};

export default ProfileLayout;
