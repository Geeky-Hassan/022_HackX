import Image from "next/image";

const UserImage = (data: any) => {
  
  const userName = data.requestedFromUser?.name || data.name || data.friendProfileImage || data.friendName||"MP"; // Prioritize requestedFromUser.name, then data.name, fallback to "U"

  return (
    <>
      {data.profilePicture ? (
        <Image
          src={data.profilePicture}
          alt={`${userName}'s profile picture`}
          width={80}
          height={80}
          className="w-10 h-10 rounded-full border border-light-light-black"
        />
      ) : (
        <div className={`${data.friendName ? 'size-12' : data.name ? 'size-16' : 'size-14'}  flex items-center justify-center border border-text-blue/20 bg-text-blue/10 rounded-full`}>
          <p className="text-text-blue">
            {userName[0].toUpperCase()}
          </p>
        </div>
      )}
    </>
  );
};

export default UserImage;
