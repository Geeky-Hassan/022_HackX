// --------------------------
// Imports
// --------------------------
"use client";
import {useEffect, useState} from "react";
import {fetchRecommendedPeople, sendFriendRequest} from "../../mpHandler/friendsHandler";
import {UserType} from "@/types";
import InterestCard from "../../components/Cards/Interests/InterestCard";
import InterestCardLoader from "../../components/Loaders/Skeletons/InterestCardLoader";
// --------------------------
// Recommended People code starts here
// --------------------------
const RecommendedPeople = () => {
  // --------------------------
  // Setting vars
  // --------------------------
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<UserType[]>([]);

  // --------------------------
  // Getting recommended people
  // --------------------------
  const handleFetchRecommendedPeople = async () => {
    try {
      setLoading(true);
      const res = await fetchRecommendedPeople();
      setUsers(res);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // Sending friend requests
  // --------------------------
  const handleSendFriendRequest = async (userId: string) => {
    const res = await sendFriendRequest(userId);
    if (res) {
      await handleFetchRecommendedPeople();
    }
  };

  // --------------------------
  // Function call: Fetching recommended people
  // --------------------------
  useEffect(() => {
    handleFetchRecommendedPeople();
  }, []);
  return (
    <>
      <section>
        <h2 className="text-dark-secondary-text text-2xl my-5">Recommended People</h2>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? (
            Array.from({length: 5}).map((_, index) => <InterestCardLoader key={index} />)
          ) : users && users.length > 0 ? (
            users.map((user, index) => (
              <InterestCard sendFriendRequest={handleSendFriendRequest} key={index} user={user} />
            ))
          ) : (
            <p className="text-secondary-text dark:text-dark-secondary-text/70">No users found</p>
          )}
        </div>
      </section>
    </>
  );
};

export default RecommendedPeople;
