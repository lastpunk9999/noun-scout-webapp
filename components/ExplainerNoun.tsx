import useFakeNoun from "../hooks/useFakeNoun";
import Image from "next/image";
import { DonationsByTraitType, NounSeed } from "../types";
import { useAppContext } from "../context/state";
import { motion, AnimatePresence } from "framer-motion";
import useGetDoneeDescription from "../hooks/useGetDoneeDescription";

type ExplainerNounProps = {
  nextAuctionDonations: DonationsByTraitType;
  nounSeed: NounSeed;
  amount: number;
  doneeId: number;
};

const ExplainerNoun = (props: ExplainerNounProps) => {
  // Get image data for next auctioned Noun
  const { src } = useFakeNoun(props.nextAuctionDonations, props.nounSeed);

  const doneeDescription = useGetDoneeDescription(props.doneeId);

  function getRandomNum(min, max, decimalPlaces) {
    const rand = Math.random() * (max - min) + min;
    const power = Math.pow(10, decimalPlaces);
    return Math.floor(rand * power) / power;
  }

  return (
    <div className="relative mx-auto flex w-full">
      <AnimatePresence mode="wait">
        {src && (
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
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {src && (
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
            <span>Ξ {props.amount}</span>
            <Image
              src={`/example-arrow.svg`}
              alt="arrow"
              width={16}
              height={16}
              className="opacity-50"
            />
            <Image
              src={doneeDescription.image}
              alt="example logo"
              width={25}
              height={25}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {src && (
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
              src={src}
              alt="example trait image"
              className="w-full aspect-square rounded-md"
              layout="responsive"
              width={320}
              height={320}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExplainerNoun;
