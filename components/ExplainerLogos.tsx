import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Recipient } from "../types";

type ExplainerLogosProps = {
  recipient: Recipient;
  amount: number;
};

const ExplainerLogos = (props: ExplainerLogosProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="w-full aspect-square flex flex-col h-fit mx-auto bg-white rounded-lg border border-slate-200 relative overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
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
        <div className="p-4 h-full flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold leading-none">
            {props.amount} ETH
          </h2>
          <p className="text-md text-slate-400">Pledged to</p>
        </div>
        <div className="bg-slate-100 border-t border-t-slate-200 px-3 py-6">
          <div className="flex flex-row text-left gap-2 items-center justify-center">
            <div className="rounded-md w-full aspect-square max-w-[2.5rem] overflow-hidden">
              <Image
                src={props.recipient?.image ?? "/recipients/placeholder.svg"}
                alt={`${props.recipient?.name ?? "recipient"} logo`}
                layout="responsive"
                width={320}
                height={320}
              />
            </div>

            <p className="text-sm text-blue-500 font-bold leading-none">
              {props.recipient?.name}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExplainerLogos;
