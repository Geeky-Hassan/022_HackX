import ProfileInfoItem from "./ProfileInfoItem";
import { format } from 'date-fns';

interface ProfileInfoCardProps {
    userName: string;
    email: string;
    createdAt: string | Date;
    onEditName: () => void;
    onEditEmail: () => void;
    onEditPassword: () => void;
}

const ProfileInfoCard = ({ userName, email, createdAt, onEditName, onEditEmail, onEditPassword }: ProfileInfoCardProps) => (
    <div className="bg-[#eaf0ff] border border-text-blue/20 p-6 rounded-xl shadow-sm space-y-6">
        <ProfileInfoItem
            label="Full Name"
            value={userName || "Full Name"}
            onEdit={onEditName}
            showEdit
        />
        <ProfileInfoItem
            label="Email"
            value={email || "Enter Email"}
            onEdit={onEditEmail}
            showEdit
        />
        <ProfileInfoItem
            label="Password"
            value={"*******"}
            valueColor="font-medium text-[#4c6fff]"
            onEdit={onEditPassword}
            showEdit
        />
        <ProfileInfoItem
            label="Account created"
            value={format(new Date(createdAt ?? ""), "MMM d, yyyy")}
            valueColor="font-medium text-[#4c6fff]"
        />
    </div>
);

export default ProfileInfoCard; 