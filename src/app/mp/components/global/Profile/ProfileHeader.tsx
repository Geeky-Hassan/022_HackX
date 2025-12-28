"use client";

import { Camera } from "lucide-react";
import UserImage from "../../UserImage";

interface ProfileHeaderProps {
  userName: string;
  email: string;
  user: any;
  onEditImage?: () => void;
}

const ProfileHeader = ({ userName, email, user, onEditImage }: ProfileHeaderProps) => (
  <div className="flex items-center gap-6 mb-10 justify-between">
    <div>
      <p className="md:text-3xl text-2xl font-medium">{userName}</p>
      <p className="md:text-md text-sm text-gray-500">{email}</p>
    </div>
    <div className="relative group">
      <UserImage {...user} />
      {onEditImage && (
        <div
          className="absolute bottom-0 right-0 bg-white border rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          onClick={onEditImage}
        >
          <Camera className="text-[#4c6fff]/30 size-4 group-hover:text-[#4c6fff] transition-colors duration-200" />
        </div>
      )}
    </div>
  </div>
);

export default ProfileHeader; 