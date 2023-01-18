import ExplainerNoun from "../components/ExplainerNoun";
import ExplainerLogos from "../components/ExplainerLogos";
import ExplainerTrait from "../components/ExplainerTrait";
import useGetPledgesForUpcomingNoun from "../hooks/useGetPledgesForUpcomingNoun";
import { PledgesByTraitType, NounSeed } from "../types";
import { useEffect, useState } from "react";
import { ImageData } from "@nouns/assets";

import useGetRecipientsDescription from "../hooks/useGetRecipientsDescription";
type ExplainerProps = {
  nextAuctionPledges: PledgesByTraitType;
};

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
      title: "Request a trait",
      description: "Allow others to see which trait you want.",
    },
    {
      title: "Incentivize minting",
      description: "Pledge an amount to a non-profit of your choice.",
    },
    {
      title: "Your Noun is minted",
      description:
        "When a Noun with your trait is minted, your pledge is donated to the non-profit.",
    },
  ];

  let recipients = useGetRecipientsDescription(false);
  console.log(recipients);
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
    <div className="mx-4 my-10 flex flex-col md:grid md:grid-cols-3 gap-10">
      {explainerContent.map((step, i) => {
        return (
          <div className="text-center mb-5 md:mb-0" key={i}>
            <div className="w-full max-w-[12rem] md:aspect-square mx-auto md:mb-3 flex items-center">
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
            <span className="text-sm uppercase color-blue-500 opacity-70 mt-3 block">
              step {i + 1}
            </span>
            <h2 className="text-2xl leading-none font-bold font-serif mb-1">
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
