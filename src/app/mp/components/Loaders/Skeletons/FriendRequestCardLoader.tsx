const FriendRequestCardLoader = () => {
  return (
    <div className="flex items-center p-3 rounded-lg shadow-sm bg-custom-blue-stroke/50 dark:bg-dark-custom-blue-stroke/50  animate-pulse">
      <div className="relative flex-shrink-0">
        <div className="size-14 rounded-full bg-custom-blue-stroke" />
      </div>

      <div className="ml-4 flex-1">
        <div className="h-4 bg-custom-blue-stroke rounded w-32 mb-2" />
        <div className="h-3 bg-custom-blue-stroke/50 rounded w-24" />
      </div>
    </div>
  );
};

export default FriendRequestCardLoader;
