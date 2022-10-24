import React, { useState, useMemo } from "react";
import useBlockData from "./useBlockData";
import { useProvider } from "wagmi";
import {
  ImageData,
  getNounSeedFromBlockHash,
  getNounData,
} from "@nouns/assets";

import { buildSVG } from "@nouns/sdk";
import { NounSeed, NounSeedAndImageData } from "../types";

const { palette } = ImageData; // Used with `buildSVG``

function getNounImage(
  nounId: number | undefined,
  blockHash: string | undefined
) {
  if (nounId === undefined || blockHash === undefined)
    return {
      src: "/loading-noun.gif",
      isNounLoading: true,
    } as NounSeedAndImageData;
  const seed = getNounSeedFromBlockHash(nounId, blockHash);
  const { parts, background } = getNounData(seed);

  const svgBinary = buildSVG(parts, palette, background);
  return {
    src: `data:image/svg+xml;base64,${btoa(svgBinary)}`,
    seed,
    isNounLoading: false,
  } as NounSeedAndImageData;
}

export default function useNoun(
  nounId: number | undefined
): NounSeedAndImageData {
  const provider = useProvider();
  const [blockNumber, blockHash] = useBlockData(provider);

  return useMemo(() => getNounImage(nounId, blockHash), [nounId, blockHash]);
}
