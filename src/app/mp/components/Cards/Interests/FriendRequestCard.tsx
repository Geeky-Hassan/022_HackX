"use client";
// ------------------------
// Imports
// ------------------------
import {useState} from "react";
import {Check, X} from "lucide-react";
import moment from "moment";
import Loader from "@/app/mp/components/Loaders/Loader";
import {FriendRequestCardProps} from "@/types";
import UserImage from "../../UserImage";

// ------------------------
// Friend request code starts here
// ------------------------
const FriendRequestCard = ({friendRequest, handleAccept, handleReject}: FriendRequestCardProps) => {
  const [localLoading, setLocalLoading] = useState(false);

  // ------------------------
  // Reject friend request
  // ------------------------
  const handleRejectClick = async () => {
    setLocalLoading(true);
    await handleReject(friendRequest.id, setLocalLoading);
  };

  // ------------------------
  // Accept friend request
  // ------------------------
  const handleAcceptClick = async () => {
    setLocalLoading(true);
    await handleAccept(friendRequest.id, setLocalLoading);
  };

  return (
    <div className="flex items-center justify-center p-3 border rounded-lg border-dark-custom-blue-stroke shadow-sm bg-transparent max-w-full">
      <div className="relative flex-shrink-0 p-2">
        <UserImage {...friendRequest} />
      </div>
      <div className="ml-4 flex-1">
        <div className="text-light-light-black dark:text-dark-primary-text mb-2">
          {friendRequest.requestedFromUser.name}
        </div>
        <div className="text-sm text-slate-400 dark:text-dark-secondary-text/50">
          {moment(friendRequest.createdAt || new Date()).fromNow()}
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          disabled={localLoading}
          className="p-2 border border-red-400 text-red-400 hover:text-white hover:border-red-400 transition-all hover:bg-red-400 rounded-full"
          onClick={handleRejectClick}
        >
          {localLoading ? <Loader size={18} color="white" /> : <X size={18} className="" />}
        </button>
        <button
          onClick={handleAcceptClick}
          disabled={localLoading}
          className="p-2 border border-dark-logo-primary text-dark-logo-primary hover:bg-dark-logo-primary transition-all hover:text-white rounded-full"
        >
          {localLoading ? <Loader size={18} color="white" /> : <Check size={18} className="" />}
        </button>
      </div>
    </div>
  );
};

export default FriendRequestCard;
