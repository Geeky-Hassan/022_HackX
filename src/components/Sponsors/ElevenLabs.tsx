import Image from "next/image";
import Link from "next/link";

import elevenLabs from "@/assets/images/sponsors/elevenlabs.webp";
const ElevenLabs = () => {
  return (
    <div className="relative w-full h-48 overflow-hidden mb-16 rounded-2xl shadow-2xl group">
      <Image
        src={elevenLabs}
        alt="ElevenLabs Background"
        width={150}
        height={30}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white px-6">
        <div className="text-center space-y-6 transform transition-all duration-500">
          <div className="space-y-2">
            <p className="text-sm font-medium tracking-wider uppercase text-gray-100">Powered By</p>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto" />
          </div>

          <Link
            target="_blank"
            href="https://elevenlabs.io/text-to-speech"
            className="block transition-all duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent rounded-lg"
          >
            <img
              src="https://eleven-public-cdn.elevenlabs.io/payloadcms/cy7rxce8uki-IIElevenLabsGrants%201.webp"
              alt="ElevenLabs Text to Speech"
              className="md:w-[320px] w-[280px] h-auto drop-shadow-lg transition-all duration-300"
            />
          </Link>

          <p className="text-xs text-gray-100 font-light tracking-wide">
            Advanced AI Voice Technology
          </p>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none" />
    </div>
  );
};

export default ElevenLabs;
