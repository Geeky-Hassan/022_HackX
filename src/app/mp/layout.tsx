// ----------------------
// Imports
// ----------------------
import "./mp.css";
import "katex/dist/katex.min.css";
import { Poppins } from "next/font/google";
import AppSidebar from "./components/global/AppSidebar";
import { ToastProvider } from "./components/Toast";
import { QueryProvider } from "@/lib/queryClient";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Choose weights
  variable: "--font-poppins",
});

// ----------------------
// MP code starts here
// ----------------------
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <ToastProvider>
        <div className="flex min-h-screen md:flex-row flex-col">
          <AppSidebar />
          <main className="flex-1 relative lg:overflow-y-auto lg:h-screen">{children}</main>
        </div>
      </ToastProvider>
    </QueryProvider>
  );
}
