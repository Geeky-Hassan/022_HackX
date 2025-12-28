"use client";

import {useState, useEffect} from "react";
import MessageDisplay from "../../components/global/MessageDisplay";
import SettingsHeader from "./SettingsHeader";
import {Monitor, Moon, Sun, Save} from "lucide-react";
import ThemeButton from "./ThemeButton";
import stateStore from "@/store/zuStore";
import SettingInput from "../../components/global/Settings/SettingInput";
import axios from "axios";
import Cookies from "js-cookie";
import {getDirtyFields} from "@/util/helpers";

const SettingsContentArea = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {theme, user} = stateStore();
  const [bio, setBio] = useState(user?.bio || "");
  const [degree, setDegree] = useState(user?.degree || "");
  const [institution, setInstitution] = useState(user?.institution || "");

  // Store initial values for change detection
  const [initialValues, setInitialValues] = useState({
    bio: user?.bio || "",
    degree: user?.degree || "",
    institution: user?.institution || "",
  });

  // State to track if changes were made
  const [hasChanges, setHasChanges] = useState(false);

  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUser = async () => {
    const token = Cookies.get("serviceToken");
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Check for changes in any input
  useEffect(() => {
    const changed =
      bio !== initialValues.bio ||
      degree !== initialValues.degree ||
      institution !== initialValues.institution;

    if (changed && !isVisible) {
      setIsVisible(true);
    } else if (!changed && isVisible) {
      setIsVisible(false);
    }

    setHasChanges(changed);
  }, [bio, degree, institution, initialValues, isVisible]);

  /**
   * Handles saving profile changes to the server
   * Only sends fields that have been modified to optimize network requests
   */
  const handleSaveChanges = async () => {
    // Start the slide-down animation and clear any previous errors
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Get current form values
      const currentValues = {bio, degree, institution};

      // Use helper function to get only the changed fields
      const changedFields = getDirtyFields(currentValues, initialValues);

      // Early exit if no changes detected (safety check)
      if (Object.keys(changedFields).length === 0) {
        setIsSubmitting(false);
        setIsVisible(false);
        return;
      }

      // Get authentication token
      const token = Cookies.get("serviceToken");

      // Make PUT request to update user profile with only changed fields
      await axios.put("https://campuscompanionserver.fly.dev/v1/users", changedFields, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Success handling: Update UI states after a brief delay for smooth animation
      setTimeout(() => {
        setSuccessMessage("Profile updated successfully!");

        // Update initial values to current values so future comparisons work correctly
        setInitialValues({
          bio,
          degree,
          institution,
        });

        // Reset all UI states to hide the save button and clear loading state
        setHasChanges(false);
        setIsSubmitting(false);
        setIsVisible(false);
      }, 300); // Brief delay for smooth user experience
    } catch (error: any) {
      console.error("Error updating profile:", error);

      // Determine appropriate error message based on HTTP status code
      let errorMsg = "Failed to update profile. Please try again.";

      if (error.response?.status === 401) {
        errorMsg = "Session expired. Please log in again.";
      } else if (error.response?.status === 400) {
        errorMsg = error.response.data?.message || "Invalid data provided.";
      } else if (error.response?.status >= 500) {
        errorMsg = "Server error. Please try again later.";
      }

      // Show error message and reset loading state (keep save button visible for retry)
      setTimeout(() => {
        setErrorMessage(errorMsg);
        setIsSubmitting(false);
        // Note: Don't hide the save button on error so user can retry
      }, 300);
    }
  };

  return (
    <>
      {/* Settings Header */}
      <SettingsHeader />

      {/* Theme Selector */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <ThemeButton label="Light" icon={<Sun />} isActive={theme === "light"} value="light" />
        <ThemeButton label="Dark" icon={<Moon />} isActive={theme === "dark"} value="dark" />
        <ThemeButton
          label="System"
          icon={<Monitor />}
          isActive={theme === "system"}
          value="system"
        />
      </div>

      {/* Academic Information */}
      <h3 className="text-xl font-medium mt-8 mb-4">Customize Your Profile</h3>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-6">
        <SettingInput
          label="Degree"
          description="Your degree or field of study"
          type="text"
          value={degree}
          onChange={(e) => {
            setDegree(e.target.value);
          }}
        />
        <SettingInput
          label="Institution"
          description="University or educational institution"
          type="text"
          value={institution}
          onChange={(e) => {
            setInstitution(e.target.value);
          }}
        />
      </div>

      <div className="mb-16">
        <SettingInput
          label="Bio"
          description="Tell PathAI about yourself"
          type="textarea"
          value={bio}
          onChange={(e) => {
            setBio(e.target.value);
          }}
        />
      </div>

      {/* Floating Save Button - with animation */}
      <div
        className={`fixed bottom-8 right-8 z-50 transition-all duration-500 ease-in-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
        } ${isSubmitting ? "translate-y-20 opacity-0" : ""}`}
      >
        <button
          disabled={isSubmitting}
          className="px-6 py-3 bg-logo-primary text-white rounded-full shadow-lg hover:bg-logo-primary/90 transition-all flex items-center gap-2"
          onClick={handleSaveChanges}
        >
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Messages */}
      <MessageDisplay successMessage={successMessage} errorMessage={errorMessage} />
    </>
  );
};

export default SettingsContentArea;
