// ------------------------
// Imports
// ------------------------
import {Search} from "lucide-react";
// ------------------------
// Search recommended people code starts here
// ------------------------
const SearchRecommendedPeople = () => {
  return (
    <>
      <div className="my-5">
        <div className="relative flex flex-row max-w-md border border-dark-custom-blue-stroke dark:bg-dark-custom-blue rounded-xl px-4 py-3">
          <input
            type="text"
            placeholder="Search by name"
            className="w-full bg-transparent outline-none focus:outline-none text-light-light-black dark:text-dark-primary-text placeholder:dark:text-dark-secondary-text/50"
          />
          <Search className="absolute top-1/2 right-4 transform -translate-y-1/2 text-light-light-black dark:text-dark-secondary-text z-10" />
        </div>
      </div>
      <h2 className="text-dark-secondary-text text-2xl my-5">Recommended people</h2>
    </>
  );
};

export default SearchRecommendedPeople;
