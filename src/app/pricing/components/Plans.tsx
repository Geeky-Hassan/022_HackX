"use client";
import {getUSDPrice, getUserLocation, pricingPlans} from "@/data/constants";
import Link from "next/link";
import {useEffect, useState} from "react";

const Plans = () => {
  const [country, setCountry] = useState<string>("PK");
  const [price, setPrice] = useState<number>(0);
  useEffect(() => {
    const getUserSpecificPlans = async () => {
      const res = await getUserLocation();

      if (res.country !== "PK") {
        const price = await getUSDPrice(1500);
        setCountry(res.country);
        setPrice(price.conversion_result);
      }
    };
    getUserSpecificPlans();
  }, []);
  return (
    <div className="relative z-0 pb-20 md:mx-7">
      {/* Background Split (goes below cards) */}
      <div className="absolute top-0 left-0 w-full h-[60%] bg-white z-0"></div>
      <div
        className="absolute bottom-0 left-0 w-full h-[60%] z-0 bg-gradient-to-t from-dark-logo-primary to-dark-logo-primary-gradient "
        // style={{
        //   background: "linear-gradient(180deg, #1D68FF, #113E99)",
        // }}
      ></div>

      <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 px-0 md:px-10 xl:px-[11rem] py-11 z-10">
        {pricingPlans.map((plan, index) => (
          <div
            key={index}
            className={`relative mx-auto w-full max-w-md flex flex-col justify-between border bg-white text-center p-8 rounded-2xl h-[510px] transition-all duration-300 ${
              plan.recommended ? "ring-2 ring-[#1D68FF] scale-105 z-10" : ""
            }`}
          >
            {plan.recommended && (
              <div
                className="absolute -top-5 left-1/2 -translate-x-1/2 text-white font-semibold py-1 rounded-full shadow px-3"
                style={{
                  fontSize: "12px",
                  background: "linear-gradient(180deg, #113E99, #1D68FF)",
                }}
              >
                Bhai ki mano, aur ye Plan lo!
              </div>
            )}

            <h4 className="text-xl font-bold mb-5 text-black">{plan.title}</h4>

            <div className="mb-6 text-3xl font-bold text-black">
              {
                plan.title === "Institutional Plan"
                  ? "" // No price for Institutional Plan
                  : plan.title === "Exam Plan" && country !== "PK"
                    ? `$ ${Math.round(price)}` // Special formatting for Exam Plan outside Pakistan
                    : country === "PK"
                      ? `PKR. ${plan.price}` // Pakistani prices in Rs.
                      : `$ ${Math.round(plan?.price || 0)}` // All other countries in USD
              }
            </div>

            <ul className="list-disc list-inside space-y-3 text-black text-left marker:text-[#1D68FF]">
              {plan.features?.map((feature, featureIndex) => (
                <li key={featureIndex} className="">
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link
                href={
                  plan.buttonText.includes("Contact") ? "mailto:info2mypath@gmail.com" : "/mp/login"
                }
              >
                <button
                  className={`w-full py-3 rounded-full text-sm font-semibold border border-transparent transition-all duration-300 ${
                    plan.recommended
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:bg-dark-secondary-text  hover:border-[#1D68FF]"
                      : "bg-dark-logo-primary text-white"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
