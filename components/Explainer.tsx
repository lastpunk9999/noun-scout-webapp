import ExplainerNoun from "../components/ExplainerNoun";
import ExplainerLogos from "../components/ExplainerLogos";
import ExplainerTrait from "../components/ExplainerTrait";
import useGetDonationsForUpcomingNoun from "../hooks/useGetDonationsForUpcomingNoun";
import { DonationsByTraitType, NounSeed } from "../types";
import { useEffect, useState } from "react";
import { ImageData } from "@nouns/assets";
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

  useEffect(() => {
    const timerId = setInterval(() => {
      setNounSeed(buildNounSeed());
    }, 5000);
    return () => {
      clearInterval(timerId);
    };
  }, [props.nextAuctionDonations]);

  return (
    <div className="mx-4 my-10 flex md:grid grid-cols-3 gap-10">
      {explainerContent.map((step, i) => {
        return (
          <div className="text-center mb-5 md:mb-0">
            <div className="w-full max-w-[10rem] aspect-square mx-auto md:mb-3">
              {i === 0 && (
                <ExplainerTrait
                  nextAuctionDonations={props.nextAuctionDonations}
                  nounSeed={nounSeed}
                />
              )}
              {i === 1 && <ExplainerLogos />}
              {i === 2 && (
                <ExplainerNoun
                  nextAuctionDonations={props.nextAuctionDonations}
                  nounSeed={nounSeed}
                />
              )}
            </div>
            <span className="text-sm uppercase color-blue-500 opacity-70">
              step {i + 1}
            </span>
            <h2 className="text-2xl font-bold font-serif mb-1">{step.title}</h2>
            <p className="text-md color-slate-400">{step.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Explainer;
