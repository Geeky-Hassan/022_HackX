const InterestCardLoader = () => {
  return (
    <div className="relative p-3 rounded-lg bg-custom-blue bg-custom-blue-stroke/50 dark:bg-dark-custom-blue-stroke/50 transition-colors animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="rounded-full bg-custom-blue-stroke"></div>
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-custom-blue-stroke rounded w-1/2"></div>
          <div className="h-3 bg-custom-blue-stroke rounded w-1/3"></div>
        </div>
      </div>
      <div className="w-full h-8 rounded-md bg-custom-blue-stroke"></div>
    </div>
  );
};

export default InterestCardLoader;
