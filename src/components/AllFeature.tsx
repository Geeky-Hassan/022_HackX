"use client";

import FadeInWhenVisible from "./Animation";
import {featureContent} from "../data/constants";
import dynamic from "next/dynamic";
// Dynamically import Lottie Player (disable SSR)
const FeatureLottie = dynamic(() => import("./FeatureLottie"), {
  ssr: false,
});

const AllFeature = () => {
  return (
    <div className="bg-white px-4 py-8 mt-10 mb-20">
      <div className="max-w-6xl mx-auto">
        <div>
          <div className="text-[14px] font-normal text-dark-logo-primary tracking-[4px] uppercase leading-[20px] text-left font-promixa">
            {featureContent.featureTitle}
          </div>
          <div className="text-[48px] font-semibold text-dark-logo-primary tracking-[-1px] leading-[58px] mt-3 text-left">
            {featureContent.mainHeading}
          </div>
          <div className="font-promixa text-dark-logo-primary text-[20px] font-light text-left mt-2">
            {featureContent.subHeading}
          </div>
        </div>
        {featureContent.feature.map((feature, index) => (
          <FadeInWhenVisible key={index}>
            <div
              className={`flex flex-col md:flex-row ${index % 2 === 0 ? "" : "md:flex-row-reverse"} items-start md:items-center gap-6 mt-8 h-full`}
            >
              <div className="w-full md:w-1/2 h-full">
                <FeatureLottie src={feature.img} />
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-center items-start">
                <div className="text-dark-logo-primary font-semibold text-[32px] md:text-[36px] leading-[42px] md:leading-[46px]">
                  {feature.title}
                </div>
                <div className="font-promixa text-gray-500 text-[18px] leading-[26px] md:leading-[28px] font-normal mt-5">
                  {feature.description}
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        ))}
      </div>
    </div>
  );
};

export default AllFeature;
