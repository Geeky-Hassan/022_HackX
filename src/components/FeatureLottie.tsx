"use client";
import React from "react";
import {Player} from "@lottiefiles/react-lottie-player";

type FeatureLottieProps = {
  src: string;
};

const FeatureLottie: React.FC<FeatureLottieProps> = ({src}) => (
  <Player
    src={src}
    background="transparent"
    speed={1}
    style={{width: "100%", maxWidth: 320, height: 220}}
    loop
    autoplay
  />
);

export default FeatureLottie;
