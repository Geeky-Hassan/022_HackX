"use client";

import Carousel from "../carousel";

const HomeHero = () => {
  return (
    <>
      <section className="h-fit min-w-[320px] mx-auto rounded-md bg-gradient-to-b lg:bg-gradient-to-r from-dark-logo-primary-gradient to-dark-logo-primary">
        <Carousel />
      </section>
    </>
  );
};

export default HomeHero;
