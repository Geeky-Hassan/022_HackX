import React from "react";
import weirdPattern from "@/assets/images/weirdPattern.svg";
import Image from "next/image";
import linkedin from "@/assets/images/Socials/linkedin.svg";
import instagram from "@/assets/images/Socials/instagram.svg";
import facebook from "@/assets/images/Socials/facebook.svg";
import youtube from "@/assets/images/Socials/youtube.svg";

const SocialCard = () => {
  return (
    <main className="bg-white rounded-lg flex flex-row border-2 border-logo-primary md:w-3/5 w-4/5 mx-auto md:px-10 px-5 md:py-24 py-10 relative overflow-hidden">
      <section className="flex flex-col gap-8 items-start">
        <div className="space-y-1">
          <h3 className="text-[#1D68FF] text-2xl md:text-3xl lg:text-4xl font-semibold">
            Become a part of our community
          </h3>
          <p className="text-[#1D68FF] font-light md:text-2xl text-lg">
            Join our socials to stay up to date
          </p>
        </div>
        <div className="flex flex-row items-center gap-5">
          <a
           
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src={facebook} alt="facebook icon" className="md:w-9 w-7" />
          </a>
          <a  target="_blank" rel="noopener noreferrer">
            <Image src={instagram} alt="instagram icon" className="md:w-9 w-7" />
          </a>
          <a
           
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src={linkedin} alt="linkedin icon" className="md:w-9 w-7" />
          </a>
          <a  target="_blank" rel="noopener noreferrer">
            <Image src={youtube} alt="youtube icon" className="md:w-9 w-7" />
          </a>
        </div>
      </section>
      <section className="hidden md:block">
        <Image
          src={weirdPattern}
          alt="weird pattern"
          className="w-3/4 absolute -bottom-20 -right-64"
        />
      </section>
    </main>
  );
};

export default SocialCard;
