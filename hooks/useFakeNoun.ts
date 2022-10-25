import { useEffect, useState, useMemo, useCallback } from "react";
import {
  ImageData,
  getNounSeedFromBlockHash,
  getNounData,
} from "@nouns/assets";

import { buildSVG } from "@nouns/sdk";
import { NounSeed, NounSeedAndImageData, DonationsByTraitType } from "../types";

const { palette } = ImageData;

export default function useFakeNoun(
  donationData: DonationsByTraitType
): NounSeedAndImageData {
  const [seed, setSeed] = useState<NounSeed>();

  const generateNewSeed = useCallback(() => {
    const newSeed = {} as NounSeed;
    newSeed.background = Math.floor(Math.random() * 2);
    newSeed.body = Math.floor(Math.random() * 4);
    newSeed.accessory = Math.floor(Math.random() * 4);
    newSeed.head = Math.floor(Math.random() * 4);
    newSeed.glasses = Math.floor(Math.random() * 4);
    setSeed(newSeed);
  }, [setSeed, donationData]);

  useEffect(() => {
    generateNewSeed();
    const timerId = setInterval(generateNewSeed, 5000);
    return () => {
      clearInterval(timerId);
    };
  }, [generateNewSeed]);

  const svgBinary = useMemo(() => {}, [seed]);

  return useMemo(() => {
    let svgBinary;
    if (seed) {
      const { parts, background } = getNounData(seed);
      svgBinary = buildSVG(parts, palette, background);
    }

    return {
      src: svgBinary
        ? `data:image/svg+xml;base64,${btoa(svgBinary)}`
        : "/loading-noun.gif",
      seed,
      isNounLoading: !svgBinary,
    } as NounSeedAndImageData;
  }, [seed]);
}
