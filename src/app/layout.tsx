import {Outfit} from "next/font/google";
const outfit = Outfit({subsets: ["latin"]});
import type {Metadata} from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {Analytics} from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Home | MyPath AI",
  description:
    "MyPath is your personalized education companion, guiding students from Grade 9 to PhD with AI-powered tools. Whether you need learning support, mental wellness resources, accommodation details, or career-building features, MyPath is here to help you succeed at every step of your journey. Together, we pave the way to a brighter future.",
  icons: "/Logo/logo.svg",
  manifest: "./manifest.json",
  keywords: ["mypath", "ai", "classroom", "career", "education"],
  authors: [
    {
      name: "Noor Ul Hassan",
      url: "https://www.linkedin.com/in/geeky-hassan/",
    },
    {
      name: "Athar Naveed",
      url: "https://www.linkedin.com/in/athar-naveed-477775224/",
    },
    {
      name: "Khawaja M. Bilal",
      url: "https://www.linkedin.com/in/bilalk902/",
    },
    {
      name: "Fahad Rashid",
      url: "https://www.linkedin.com/in/fahad-rashid-6a45b2274/",
    },
    {
      name: "Hurr Ali",
      url: "https://www.linkedin.com/in/hurrali/",
    },
    {
      name: "M. Umair Tahir",
      url: "https://www.linkedin.com/in/muhammad-umair-tahir/",
    },
    {
      name: "Mohib Atif",
      url: "https://www.linkedin.com/in/iamohib/",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={`${outfit.className} bg-white`}>
        <Analytics />
        <Navbar />
        <div className="">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
