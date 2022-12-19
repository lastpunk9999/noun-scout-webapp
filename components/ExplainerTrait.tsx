import { useMemo } from "react";
import { getPartData, ImageData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { DonationsByTraitType, NounSeed } from "../types";
import { traitTypeNamesById } from "../utils";

type ExplainerTraitProps = {
  nounSeed: NounSeed;
};

const getHeadPart = (headId: number) => {
  const data = getPartData("heads", headId);
  return `data:image/svg+xml;base64,${btoa(
    buildSVG([{ data }], ImageData.palette)
  )}`;
};

const ExplainerTrait = (props: ExplainerTraitProps) => {
  const image = useMemo(
    () => getHeadPart(props.nounSeed.head),
    [props.nounSeed.head]
  );
  const bgColor = ImageData.bgcolors[props.nounSeed.background];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="w-full mx-auto scale-125 bg-white rounded-lg border border-slate-200 p-2"
        style={{ backgroundColor: `#${bgColor}` }}
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
      >
        <Image
          src={image}
          className="w-full aspect-square rounded"
          layout="responsive"
          width={320}
          height={320}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default ExplainerTrait;
