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

const Explainer = (props: ExplainerProps) => {
  const [nounSeed, setNounSeed] = useState<NounSeed>({
    background: Math.floor(Math.random() * 2),
    body: Math.floor(Math.random() * 4),
    accessory: Math.floor(Math.random() * 4),
    head: Math.floor(Math.random() * 4),
    glasses: Math.floor(Math.random() * 4),
  });
  const explainerContent = [
    {
      title: "Choose a trait",
      description:
        "Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
    },
    {
      title: "Select a charity",
      description:
        "Nulla vitae elit libero, a pharetra augue. Aenean lacinia bibendum nulla sed consectetur.",
    },
    {
      title: "Send Eth to charity on mint",
      description:
        "When a Noun with your trait is minted, the ETH will be sent to a non-profit of your choice",
    },
  ];
  const buildNounSeed = () => {
    const newSeed = {} as NounSeed;
    newSeed.background = Math.floor(Math.random() * 2);
    newSeed.body = Math.floor(Math.random() * ImageData.images.bodies.length);
    newSeed.accessory = Math.floor(
      Math.random() * ImageData.images.accessories.length
    );
    newSeed.head = Math.floor(Math.random() * ImageData.images.heads.length);
    newSeed.glasses = Math.floor(
      Math.random() * ImageData.images.glasses.length
    );
    return newSeed;
  };

  function getRandomNum(min, max, decimalPlaces) {
    const rand = Math.random() * (max - min) + min;
    const power = Math.pow(10, decimalPlaces);
    return Math.floor(rand * power) / power;
  }

  const doneesList = useAppContext()[0];
  const doneesContent = doneesList.map((org, i) => {
    const donee = useGetDoneeDescription(i);
    return donee;
  });
  const eligibleDonees = doneesContent.filter((org) => org.active && org.image);

  const [exampleDonationAmount, setExampleDonationAmount] = useState(1);
  const [exampleDoneeId, setExampleDoneeId] = useState(1);

  const handleChange = () => {
    setNounSeed(buildNounSeed());
    setExampleDonationAmount(getRandomNum(0, 10, 2));
    setExampleDoneeId(Math.floor(Math.random() * eligibleDonees.length));
    return;
  };

  useEffect(() => {
    const timerId = setInterval(() => {
      handleChange();
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
            <p className="text-md color-slate-400">{step.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Explainer;
