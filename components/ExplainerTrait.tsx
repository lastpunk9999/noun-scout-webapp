import { getNounData, getPartData, ImageData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import { BigNumber, utils } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import { nounsTokenContract } from "../config";
import useFakeNoun from "../hooks/useFakeNoun";
import useGetDonationsForUpcomingNoun from "../hooks/useGetDonationsForUpcomingNoun";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Donation,
  DonationsByTraitType,
  NounSeed,
  TraitAndDonations,
  TraitNameAndImageData,
} from "../types";
import { traitTypeNamesById } from "../utils";
import RequestCard from "./RequestCard";

type ExplainerTraitProps = {
  nextAuctionDonations: DonationsByTraitType;
  nounSeed: NounSeed;
  handleChange: Function;
};

const ExplainerTrait = (props: ExplainerTraitProps) => {
  const getPart = (partType: string, partIndex: number) => {
    const data = getPartData(partType, partIndex);
    const image = `data:image/svg+xml;base64,${btoa(
      buildSVG([{ data }], ImageData.palette)
    )}`;
    return { image };
  };
  const traitImage = getPart(traitTypeNamesById(3)[1], props.nounSeed.head);

  return (
    <AnimatePresence mode="wait">
      {traitImage && (
        <motion.button
          className="w-full mx-auto scale-125 bg-white rounded-lg border border-slate-200 p-2"
          key={props.nounSeed.head}
          initial={{
            scale: 0,
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            scale: [1, 0.8, 1],
            transition: {
              delay: 0.25,
              duration: 0.1,
            },
          }}
          exit={{
            y: -10,
            opacity: 0,
          }}
          transition={{
            times: [0, 0.5, 1],
            duration: 0.2,
          }}
          onClick={() => props.handleChange()}
        >
          <Image
            src={traitImage.image}
            alt="example trait image"
            className="w-full aspect-square rounded"
            layout="responsive"
            width={320}
            height={320}
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ExplainerTrait;
