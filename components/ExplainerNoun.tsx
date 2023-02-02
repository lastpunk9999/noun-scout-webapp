import { useMemo } from "react";
import Image from "next/image";
import { PledgesByTraitType, NounSeed, Recipient } from "../types";
import { motion, AnimatePresence } from "framer-motion";

import {
  ImageData,
  getNounSeedFromBlockHash,
  getNounData,
} from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
const { palette } = ImageData;

type ExplainerNounProps = {
  nounSeed: NounSeed;
  amount: number;
  recipient: Recipient;
};

const getNounImage = (nounSeed) => {
  const { parts, background } = getNounData(nounSeed);
  return `data:image/svg+xml;base64,${btoa(
    buildSVG(parts, palette, background)
  )}`;
};

const ExplainerNoun = (props: ExplainerNounProps) => {
  const image = useMemo(() => getNounImage(props.nounSeed), [props.nounSeed]);

  return (
    <div className="relative mx-auto flex w-full">
      <AnimatePresence mode="wait">
        <motion.div
          className="absolute -top-[6px] -left-[6px] z-10"
          key={props.nounSeed.head}
          initial={{
            y: 0,
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            transition: {
              delay: 0.65,
              duration: 0.2,
            },
          }}
          exit={{
            y: -10,
            opacity: 0,
          }}
        >
          <span className="py-1 px-2 bg-green-600 text-white font-bold text-sm block rounded-md">
            Matched!
          </span>
        </motion.div>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div
          className="bg-white p-2 flex flex-row gap-2 w-fit rounded-md shadow-md items-center absolute -bottom-[6px] -right-[20px] z-10"
          key={props.nounSeed.head}
          initial={{
            y: 20,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              delay: 0.75,
              duration: 0.2,
            },
          }}
          exit={{
            y: -10,
            opacity: 0,
          }}
        >
          <span>{props.amount} ETH</span>
          <Image
            src={`/example-arrow.svg`}
            alt="arrow"
            width={16}
            height={16}
            className="opacity-50"
          />
          <Image
            src={props.recipient.image}
            alt={`${props.recipient.name} logo`}
            width={25}
            height={25}
          />
        </motion.div>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div
          className="w-full"
          key={props.nounSeed.head}
          initial={{
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: [1, 0.8, 1],
            opacity: 1,
            transition: {
              delay: 0.5,
              duration: 0.1,
            },
          }}
          exit={{
            y: 0,
            opacity: 0,
          }}
        >
          <Image
            src={image}
            alt="example trait image"
            className="w-full aspect-square rounded-md"
            layout="responsive"
            width={320}
            height={320}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ExplainerNoun;
