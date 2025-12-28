"use client";

// Imports
import {useState} from "react";
import stateStore from "@/store/zuStore";
import Cookies from "js-cookie";

// Component imports
import ProfileHeader from "../../components/global/Profile/ProfileHeader";
import ProfileInfoCard from "../../components/global/Profile/ProfileInfoCard";
import MessageDisplay from "../../components/global/MessageDisplay";

// Main Component
const ProfileSettings = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {user, userName} = stateStore();

  // Event Handlers
  const handleLogout = () => {
    Cookies.remove("serviceToken");
    localStorage.clear();
    sessionStorage.clear();
    location.reload();
  };

  const handleEditImage = () => {
    console.log("Edit image clicked");
  };

  const handleEditName = () => {
    console.log("Edit name clicked");
  };

  const handleEditEmail = () => {
    console.log("Edit email clicked");
  };

  const handleEditPassword = () => {
    console.log("Edit password clicked");
  };

  return (
    <>
      {/* Profile Header */}
      <ProfileHeader
        userName={userName || ""}
        email={user?.email || ""}
        user={user}
        onEditImage={handleEditImage}
      />

      {/* Profile Info Card */}
      <ProfileInfoCard
        createdAt={user?.createdAt || new Date()}
        userName={userName || ""}
        email={user?.email || ""}
        onEditName={handleEditName}
        onEditEmail={handleEditEmail}
        onEditPassword={handleEditPassword}
      />

      {/* Messages */}
      <MessageDisplay successMessage={successMessage} errorMessage={errorMessage} />
    </>
  );
};

export default ProfileSettings;
