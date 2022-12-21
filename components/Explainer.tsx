import ExplainerNoun from "../components/ExplainerNoun";
import ExplainerLogos from "../components/ExplainerLogos";
import ExplainerTrait from "../components/ExplainerTrait";
import useGetDonationsForUpcomingNoun from "../hooks/useGetDonationsForUpcomingNoun";
import { DonationsByTraitType, NounSeed } from "../types";
import { useEffect, useState } from "react";
import { ImageData } from "@nouns/assets";
import { useAppContext } from "../context/state";
import useGetDoneeDescription from "../hooks/useGetDoneeDescription";
type ExplainerProps = {
  nextAuctionDonations: DonationsByTraitType;
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

  const [exampleDonationAmount, setExampleDonationAmount] = useState(
    getRandomNum(0, 10, 2)
  );
  const [exampleDoneeId, setExampleDoneeId] = useState(1);

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
        "When a Noun with your trait is minted, the non-profit is sent your pledged amount.",
    },
  ];

  const { donees = [] } = useAppContext() ?? {};
  const eligibleDonees = donees
    .map((org, i) => useGetDoneeDescription(i))
    .filter((org) => org.active && org.image);

  useEffect(() => {
    const timerId = setInterval(() => {
      setNounSeed(buildNounSeed());
      setExampleDonationAmount(getRandomNum(0, 10, 2));
      setExampleDoneeId(Math.floor(Math.random() * eligibleDonees.length));
    }, 7500);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div className="mx-4 my-10 flex flex-col md:grid md:grid-cols-3 gap-10">
      {explainerContent.map((step, i) => {
        return (
          <div className="text-center mb-5 md:mb-0" key={i}>
            <div className="w-full max-w-[12rem] md:aspect-square mx-auto md:mb-3 flex items-center">
              {i === 0 && <ExplainerTrait nounSeed={nounSeed} />}
              {i === 1 && (
                <ExplainerLogos
                  doneeId={exampleDoneeId}
                  amount={exampleDonationAmount}
                />
              )}
              {i === 2 && (
                <ExplainerNoun
                  nounSeed={nounSeed}
                  doneeId={exampleDoneeId}
                  amount={exampleDonationAmount}
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
