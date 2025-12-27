import HomeHero from "@/components/ui/HomeHero";
// import Affilation from "../components/Affilation";

import Features from "@/components/ui/Features";

import ElevenLabs from "@/components/Sponsors/ElevenLabs";

export default function Home() {
  return (
    <>
      <HomeHero />
      {/* <Affilation /> */}
      <Features />

      <ElevenLabs />
      <br />
    </>
  );
}
