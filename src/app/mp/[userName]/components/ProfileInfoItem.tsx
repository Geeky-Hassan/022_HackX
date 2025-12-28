import { PencilLine } from "lucide-react";

interface ProfileInfoItemProps {
    label: string;
    value: string;
    onEdit?: () => void;
    showEdit?: boolean;
    valueColor?: string;
}

const ProfileInfoItem = ({
    label,
    value,
    onEdit,
    showEdit = false,
    valueColor = " text-lg"
}: ProfileInfoItemProps) => (
    <div className="flex justify-between items-center">
        <div>
            <p className="text-md text-neutral-500">{label}</p>
            <p className={valueColor}>{value}</p>
        </div>
        {showEdit && onEdit && (
            <button
                onClick={onEdit}
                className="text-[#4c6fff] group text-md font-medium hover:underline"
            >
                <PencilLine className="text-[#4c6fff]/40 size-5 group-hover:text-[#4c6fff] transition-colors duration-200"/>
            </button>
        )}
    </div>
);

export default ProfileInfoItem; 