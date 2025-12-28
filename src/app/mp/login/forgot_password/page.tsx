import {Metadata} from "next";
import ForgotPass from "../../components/Forms/Forgot-Pass";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Forgot Password",
  keywords: "Forgot Password",
  icons: "/Logo/logo.svg",
};

export default function ForgotPassword() {
  return (
    <>
      <ForgotPass />
    </>
  );
}
