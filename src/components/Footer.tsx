"use client";

import {usePathname} from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {quickLinks} from "@/data/constants";
import SocialCard from "./Footer/SocialCard";
import logoWhite from "@/assets/images/Logo/logoWhite.svg";

export default function Footer() {
  const path = usePathname();

  if (path.includes("mp")) return null;

  const showSocialCard = path !== "/pricing";

  return (
    <footer className="bg-gradient-to-t from-dark-logo-primary-gradient to-dark-logo-primary md:mx-7 mt-[5rem] text-white md:mb-5 mb-0">
      {showSocialCard && (
        <div className="relative bottom-20">
          <SocialCard />
        </div>
      )}
      <div className="mx-0 px-7">
        <div className="flex md:flex-row flex-col gap-20">
          <Image
            src={logoWhite}
            alt="MyPath AI"
            className="mr-2 md:size-1/4 size-1/3 bottom-0 relative"
          />
          <div className="flex flex-col w-full">
            <div className="flex flex-row items-start md:justify-start justify-between md:pb-0 pb-7 w-full h-full">
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Quick Links</h3>
                <nav>
                  <ul className="space-y-2">
                    {quickLinks.map((link, index) => (
                      <li key={index}>
                        <Link
                          href={link.href}
                          className="text-md font-light text-white hover:underline"
                        >
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="space-y-4 lg:mx-auto">
                <h3 className="text-xl font-medium">Contact Us</h3>
                <p className="text-md text-white font-light">Issues? Email us at:</p>
                <a href="mailto:info2mypath@gmail.com" className="text-md text-white">
                  support@mypath.one
                </a>
              </div>
            </div>
            <div className="mt-2 pt-6 pb-3 border-t border-white w-full text-start text-sm text-white/70 font-light">
              &copy; {new Date().getFullYear()} MyPath AI. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
