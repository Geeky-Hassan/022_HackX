import {Metadata} from "next";
import NewPasswordForm from "../components/Forms/New-Password";
import {Suspense} from "react";
import Loader from "../components/Loaders/Loader";

export const metadata: Metadata = {
  title: "Reset Password | MyPath",
  description: "Reset your password to start using MyPath.",
  icons: "/Logo/logo.svg",
};

export default function ResetPassword() {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <NewPasswordForm />
      </Suspense>
    </>
  );
}
