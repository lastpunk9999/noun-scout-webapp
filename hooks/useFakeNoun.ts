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
  donationData: DonationsByTraitType,
  nounSeed: NounSeed
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

  const svgBinary = useMemo(() => {}, [nounSeed]);

  return useMemo(() => {
    let svgBinary;
    if (nounSeed) {
      const { parts, background } = getNounData(nounSeed);
      svgBinary = buildSVG(parts, palette, background);
    }

    return {
      src: svgBinary
        ? `data:image/svg+xml;base64,${btoa(svgBinary)}`
        : "/loading-noun.gif",
        nounSeed,
      isNounLoading: !svgBinary,
    } as NounSeedAndImageData;
  }, [nounSeed]);
}
