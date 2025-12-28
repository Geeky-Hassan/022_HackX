"use client";
import MeetOurTeam from "@/components/MeetOurTeam";

const TeamPage = () => {
  return (
    <section
      className="flex justify-center items-center min-h-screen w-full"
      style={{ maxWidth: "1500px", margin: "0 auto" }}
    >
      <div className="w-full">
        <MeetOurTeam />
      </div>
    </section>
  );
};

export default TeamPage;
