const ChatHistoryLoader = () => {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-dark-custom-blue-stroke dark:border-light-light-white rounded animate-pulse">
      <div className="w-12 h-12 bg-dark-custom-blue dark:bg-light-light-white rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-dark-custom-blue dark:bg-light-light-white rounded w-24" />
          <div className="h-3 bg-dark-custom-blue dark:bg-light-light-white rounded-full w-16" />
        </div>
      </div>
    </div>
  );
};

export default ChatHistoryLoader;
