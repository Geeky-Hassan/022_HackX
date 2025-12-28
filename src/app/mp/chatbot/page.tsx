// ------------------------
// Imports
// ------------------------
import {Metadata} from "next";
import ChatbotUI from "./components/ChatbotUI";
import {Toaster} from "react-hot-toast";

// ------------------------
// Chatbot Page details
// ------------------------
export const metadata: Metadata = {
  title: "PathAI | MyPath AI",
  description: "Connect with our AI-powered chatbot to get personalized guidance and support.",
  icons: "/Logo/logo.svg",
};
// ------------------------
// Chatbot code starts here
// ------------------------
export default function Chatbot() {
  return (
    <>
      <ChatbotUI />
      <Toaster />
    </>
  );
}
