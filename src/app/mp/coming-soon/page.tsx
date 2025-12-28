import {Metadata} from "next";
import {BannerContent} from "@/data/constants";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Coming Soon!",
  description: "We are bringing you something awesome! Stay Tune.",
  icons: "/Logo/logo.svg",
};

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="text-center mb-8">
        <Image
          src="/Logo/logo.svg"
          width={100}
          height={100}
          alt="MyPath AI"
          className="mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold mb-2 text-gray-800">Coming Soon</h1>
        <p className="text-xl text-gray-600 mb-8">
          We&apos;re working hard to bring you something amazing. Stay tuned!
        </p>
      </div>

      <div className="mt-8">
        <p className="text-center text-gray-600 mb-4">
          Follow us on social media for updates:
        </p>
        <div className="flex justify-center space-x-4">
          {BannerContent.map((social, index) => (
            <Link target="_blank" href={social.href} key={index}>
              <Image src={social.image} width={100} height={100} alt={social.title} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
