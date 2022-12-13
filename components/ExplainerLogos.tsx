import { useAppContext } from "../context/state";
import Image from "next/image";
import useGetDoneeDescription from "../hooks/useGetDoneeDescription";
import { motion, AnimatePresence } from "framer-motion";

type ExplainerLogosProps = {
  doneeId: number;
  amount: number;
};

const ExplainerLogos = (props: ExplainerLogosProps) => {
  const doneeDescription = useGetDoneeDescription(props.doneeId);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="w-full flex flex-col h-fit mx-auto bg-white rounded-lg border border-slate-200 relative overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
        key={props.amount}
        initial={{
          y: 50,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
          transition: {
            delay: 0.35,
            duration: 0.2,
          },
        }}
        exit={{
          y: -50,
          opacity: 0,
        }}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold leading-none">
            {props.amount} ETH
          </h2>
          <p className="text-md text-slate-400">Pledged to</p>
        </div>
        <div className="bg-slate-100 border-t border-t-slate-200 p-3">
          <div className="flex flex-row text-left gap-2 items-center">
            <div className="rounded-full w-full aspect-square max-w-[2.5rem] overflow-hidden">
              <Image
                src={doneeDescription.image}
                alt={`${doneeDescription.name} logo`}
                layout="responsive"
                width={320}
                height={320}
              />
            </div>

            <p className="text-sm text-blue-500 font-bold leading-none">
              {doneeDescription.name}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExplainerLogos;
