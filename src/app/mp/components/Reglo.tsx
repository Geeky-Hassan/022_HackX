"use client";

import Register from "../login/components/register";
import Login from "../login/components/login";
import stateStore from "@/store/zuStore";

// Register & Login code starts here
const RegloComponent = () => {
  const reglo = stateStore((state) => state.reglo);
  return (
    <>
      <section className="">
        <div className="reglo">{reglo ? <Login /> : <Register />}</div>
      </section>
    </>
  );
};
export default RegloComponent;
