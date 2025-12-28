// -----------------------
// Imports
// -----------------------
import Image from "next/image";

// -----------------------
// Current plan code starts here
// -----------------------
const CurrentPlan = () => {
  return (
    <div className="text-dark-custom-blue rounded-md px-4 py-3 flex flex-row justify-between items-center">
      <Image
        src={"/assets/images/icons/currency_icon.svg"}
        width={30}
        height={30}
        alt={"Currency Icon"}
      />
      <div className="flex-1 pl-4">
        <p className="md:text-[18px] text-[16px]">Free Plan</p>
        {/* <p className='md:text-sm text-xs underline'>Upgrade plan</p> */}
      </div>
      {/* <Info size={20} className='opacity-40' /> */}
    </div>
  );
};

export default CurrentPlan;
