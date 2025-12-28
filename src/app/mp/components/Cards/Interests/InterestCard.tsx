"use client";
// ------------------------
// Imports
// ------------------------
import {useState} from "react";
import {UserPlus} from "lucide-react";
import Loader from "@/app/mp/components/Loaders/Loader";
import {InterestCardProps} from "@/types";
import UserImage from "../../UserImage";

// ------------------------
// Interest Card starts here
// ------------------------
const InterestCard = ({user, sendFriendRequest}: InterestCardProps) => {
  // ------------------------
  // Setting vars
  // ------------------------
  const [loading, setLoading] = useState<boolean>(false);
  const [isFriend, setIsFriend] = useState<boolean>(false);

  // ------------------------
  // Add Friend
  // ------------------------
  const handleAddFriend = async () => {
    if (isFriend) return; // Do nothing if already a friend
    setLoading(true);
    await sendFriendRequest(user.id, setLoading);
    setIsFriend(true);
    setLoading(false);
  };

  return (
    <div className="rounded-lg dark:bg-dark-custom-blue border border-dark-custom-blue-stroke transition-colors">
      <div className="py-3 px-4 flex items-center">
        <div className="flex-shrink-0 mr-4">
          <UserImage {...user} />
        </div>
        <div className="flex-grow">
          <h3 className="text-light-light-black dark:text-gray-200 break-words">{user.name}</h3>
          <p className="text-secondary-text dark:text-dark-secondary-text/70 text-sm mb-2">
            {user.bio || "No bio available"}
          </p>
          {/* <p className="text-xs text-gray-400 dark:text-light-light-white mb-3">
            0 mutual connections
          </p> */}
        </div>
        <div>
          <button
            onClick={handleAddFriend}
            className={`w-full p-3 rounded-full hidden xl:flex items-center justify-center transition-colors duration-200 ${
              loading
                ? "bg-dark-logo-primary dark:bg-dark-custom-dark-blue text-white cursor-not-allowed"
                : "bg-slate-100 dark:bg-[#2d3b4f] hover:bg-[#364761] focus:outline-none text-dark-custom-dark-blue dark:text-light-light-white hover:text-light-light-white focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            }`}
            disabled={loading}
          >
            {loading ? (
              <Loader size={16} color="white" />
            ) : (
              <>
                {/* Add Friend */}
                <UserPlus className="size-5" />
              </>
            )}
          </button>
        </div>
      </div>
      <div>
        <button
          onClick={handleAddFriend}
          className={`w-full py-2 rounded-md flex xl:hidden items-center justify-center transition-colors duration-200 ${
            loading
              ? "bg-dark-logo-primary dark:bg-dark-custom-dark-blue text-white cursor-not-allowed"
              : "bg-white border border-black dark:bg-[#2d3b4f] hover:bg-[#364761] focus:outline-none text-dark-custom-dark-blue dark:text-light-light-white hover:text-light-light-white focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          }`}
          disabled={loading}
        >
          {loading ? (
            <Loader size={16} color="white" />
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Friend
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InterestCard;
