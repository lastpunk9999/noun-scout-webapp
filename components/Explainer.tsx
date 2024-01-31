import ExplainerNoun from "../components/ExplainerNoun";
import ExplainerLogos from "../components/ExplainerLogos";
import ExplainerTrait from "../components/ExplainerTrait";
import { PledgesByTraitType, NounSeed } from "../types";
import { useEffect, useState } from "react";
import { ImageData } from "@nouns/assets";

import useGetRecipientsDescription from "../hooks/useGetRecipientsDescription";
type ExplainerProps = {};

function getRandomNum(min, max, decimalPlaces) {
  const rand = Math.random() * (max - min) + min;
  const power = Math.pow(10, decimalPlaces);
  return Math.floor(rand * power) / power;
}

const buildNounSeed = () => {
  const newSeed = {} as NounSeed;
  newSeed.background = Math.floor(Math.random() * 2);
  newSeed.body = Math.floor(Math.random() * ImageData.images.bodies.length);
  newSeed.accessory = Math.floor(
    Math.random() * ImageData.images.accessories.length
  );
  newSeed.head = Math.floor(Math.random() * ImageData.images.heads.length);
  newSeed.glasses = Math.floor(Math.random() * ImageData.images.glasses.length);
  return newSeed;
};

const Explainer = (props: ExplainerProps) => {
  const [nounSeed, setNounSeed] = useState<NounSeed | undefined>(
    buildNounSeed()
  );

  const [examplePledgeAmount, setExamplePledgeAmount] = useState(
    getRandomNum(0, 10, 2)
  );
  const [exampleRecipientId, setExampleRecipientId] = useState(0);

  const explainerContent = [
    {
      title: "1. Pick any trait",
      description:
        "Your request will be listed on Noun Scout so others can see it.",
    },
    {
      title: <span>2. Lock ETH for a good cause</span>,
      description: "Pledge any amount to a good cause of your choice.",
    },
    {
      title: <span>3. Your trait is minted</span>,
      description: (
        <>If a Noun with your requested trait is minted, your ETH is donated.</>
      ),
    },
  ];

  let recipients = useGetRecipientsDescription(false);

  // If recipients haven't loaded yet, none will be active, make sure at least 1 is in the array
  if (recipients?.every((d) => !d.active)) {
    recipients = [recipients[0]];
  } else {
    recipients = recipients.filter((d) => d.active);
  }
  useEffect(() => {
    const timerId = setInterval(() => {
      setNounSeed(buildNounSeed());
      setExamplePledgeAmount(getRandomNum(0, 10, 2));
      setExampleRecipientId(Math.floor(Math.random() * recipients.length));
    }, 7500);
    return () => {
      clearInterval(timerId);
    };
  }, [recipients]);

  return (
    <div className="mx-4 mb-5 md:mb-10 flex flex-col md:grid md:grid-cols-3 sm:gap-10">
      {/* <div className="sm:mx-[5%] md:mx-[10%] xlg:mx-[20%] my-10 flex flex-col md:grid md:grid-cols-3 gap-24 justify-center"> */}
      {explainerContent.map((step, i) => {
        return (
          <div className="text-center mb-10 md:mb-0" key={i}>
            {/* <span className="text-sm uppercase color-blue-500 opacity-70 mb-3 block">
              step {i + 1}
            </span> */}
            <div className="w-48 xs:w-full md:aspect-square mx-auto mb-3 flex items-center">
              {/* <div className="md:aspect-square mx-auto md:mb-6 flex items-center"> */}
              {i === 0 && <ExplainerTrait nounSeed={nounSeed} />}
              {i === 1 && (
                <ExplainerLogos
                  recipient={recipients[exampleRecipientId]}
                  amount={examplePledgeAmount}
                />
              )}
              {i === 2 && (
                <ExplainerNoun
                  nounSeed={nounSeed}
                  recipient={recipients[exampleRecipientId]}
                  amount={examplePledgeAmount}
                />
              )}
            </div>
            <h2 className="text-xl sm:text-2xl leading-none font-bold font-serif mb-2">
              {step.title}
            </h2>
            <p className="text-md color-slate-400 max-w-xs mx-auto">
              {step.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Explainer;
