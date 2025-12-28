interface MessageDisplayProps {
    successMessage: string;
    errorMessage: string;
}

const MessageDisplay = ({ successMessage, errorMessage }: MessageDisplayProps) => (
    <>
        {successMessage && (
            <div className="text-center text-white bg-green-600 mt-4 p-4 rounded-lg">
                {successMessage}
            </div>
        )}
        {errorMessage && (
            <div className="text-center text-white bg-red-600 mt-4 p-4 rounded-lg">
                {errorMessage}
            </div>
        )}
    </>
);

export default MessageDisplay; 