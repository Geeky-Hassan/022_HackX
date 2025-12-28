"use client";
// -------------------------------
// Imports
// -------------------------------
import {useEffect, useState} from "react";
import {
  fetchFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../../mpHandler/friendsHandler";
import FriendRequestCard from "../../components/Cards/Interests/FriendRequestCard";
import FriendRequestCardLoader from "../../components/Loaders/Skeletons/FriendRequestCardLoader";
import {FriendRequestType} from "@/types";
import {useRouter} from "next/navigation";

// -------------------------------
// Friend radar component starts here
// -------------------------------
const FriendRadar = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingMap, setLoadingMap] = useState<{[id: string]: boolean}>({});
  const [friendRequests, setFriendRequests] = useState<FriendRequestType[]>([]);
  const router = useRouter();

  // -------------------------------
  // Getting all the friend requests
  // -------------------------------
  const loadFriendRequests = async () => {
    try {
      setIsLoading(true);
      const requests = await fetchFriendRequests();
      setFriendRequests(requests || []);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      setFriendRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------
  // Getting all the friend requests
  // -------------------------------
  const setLoadingForRequest = (requestId: string, isLoading: boolean) => {
    setLoadingMap((prev) => ({...prev, [requestId]: isLoading}));
  };

  // -------------------------------
  // Accepting friend request
  // -------------------------------
  const handleAcceptFriendRequest = async (requestId: string) => {
    try {
      setLoadingForRequest(requestId, true);
      await acceptFriendRequest(requestId, router);
      setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
      await loadFriendRequests();
    } catch (error) {
      console.error(`Error accepting friend request with ID ${requestId}:`, error);
    } finally {
      setLoadingForRequest(requestId, false);
    }
  };

  // -------------------------------
  // Rejecting friend request
  // -------------------------------
  const handleRejectFriendRequest = async (requestId: string) => {
    try {
      setLoadingForRequest(requestId, true);
      await rejectFriendRequest(requestId);
      setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
      await loadFriendRequests();
    } catch (error) {
      console.error(`Error rejecting friend request with ID ${requestId}:`, error);
    } finally {
      setLoadingForRequest(requestId, false);
    }
  };

  // -------------------------------
  // Function call: Getting friend requests
  // -------------------------------
  useEffect(() => {
    loadFriendRequests();
  }, []);

  return (
    <section>
      <h2 className="text-dark-secondary-text text-2xl my-5">Friend Radar</h2>
      <div className="w-full grid lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {isLoading ? (
          Array.from({length: 3}, (_, index) => <FriendRequestCardLoader key={index} />)
        ) : friendRequests.length > 0 ? (
          friendRequests.map((request) => (
            <FriendRequestCard
              key={request.id}
              handleReject={handleRejectFriendRequest}
              handleAccept={handleAcceptFriendRequest}
              friendRequest={request}
            />
          ))
        ) : (
          <div className="text-[#83AADF]/50 my-10">No friend requests found</div>
        )}
      </div>
    </section>
  );
};

export default FriendRadar;
