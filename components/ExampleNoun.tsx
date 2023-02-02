import { BigNumber, utils } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import { nounsTokenContract } from "../config";

import useGetPledgesForUpcomingNoun from "../hooks/useGetPledgesForUpcomingNoun";
import MatchItem from "../pages/match/MatchItem";
import {
  Pledge,
  PledgesByTraitType,
  NounSeed,
  TraitAndPledges,
  TraitNameAndImageData,
} from "../types";
import { traitTypeNamesById } from "../utils";
import RequestCard from "./RequestCard";

import {
  ImageData,
  getNounSeedFromBlockHash,
  getNounData,
} from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
const { palette } = ImageData;

type ExampleNounProps = {
  nextAuctionPledges: PledgesByTraitType;
};

const ExampleNoun = (props: ExampleNounProps) => {
  const [nounSeed, setNounSeed] = useState<NounSeed>({
    background: Math.floor(Math.random() * 2),
    body: Math.floor(Math.random() * 4),
    accessory: Math.floor(Math.random() * 4),
    head: Math.floor(Math.random() * 4),
    glasses: Math.floor(Math.random() * 4),
  });
  const [pledgesForFOMOHead, setPledgesForFOMOHead] = useState<TraitAndPledges>(
    props.nextAuctionPledges.heads[0]
  );
  const [traitsWithPledges, setTraitsWithPledges] = useState<number[]>([3]);

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
    console.log("newSeed", newSeed);
    return newSeed;
  };

  const buildPledgesForFOMOHead = () => {
    const pledges = Object.values(props.nextAuctionPledges.heads);
    const length = pledges.length;
    setPledgesForFOMOHead(pledges[Math.floor(Math.random() * length)]);
  };
  const additionalExampleTraits = [1, 2, 4];

  useEffect(() => {
    const timerId = setInterval(() => {
      setNounSeed(buildNounSeed());
      buildPledgesForFOMOHead();
      // on occasion, add additional traits to the example
      const additionalTrait = [
        3,
        additionalExampleTraits[
          Math.floor(Math.random() * additionalExampleTraits.length)
        ],
      ];
      setTraitsWithPledges(nounSeed.head > 150 ? additionalTrait : [3]);
    }, 5000);
    return () => {
      clearInterval(timerId);
    };
  }, [props.nextAuctionPledges]);

  // Get image data for next auctioned Noun
  const { parts, background } = getNounData(nounSeed);
  const image = `data:image/svg+xml;base64,${btoa(
    buildSVG(parts, palette, background)
  )}`;

  // Find pledges that match the FOMO Noun head
  // const pledgesForFOMOHead = props.nextAuctionPledges.heads[0];

  const totalPledgesForFOMOHead = pledgesForFOMOHead?.pledges
    .map((d) => d.amount)
    .reduce((m, d) => m.add(d));

  return (
    <div className="bg-white p-5 rounded-lg border border-slate-200 pb-4">
      <div className="text-center mb-5">
        <h2 className="text-2xl font-serif">How it works</h2>
        <p>
          If this Noun were minted,{" "}
          {!totalPledgesForFOMOHead
            ? "no funds would be sent to non-profits."
            : `${utils.formatEther(
                totalPledgesForFOMOHead
              )} ETH would be sent to non-profits.`}
        </p>
      </div>
      <div className="mb-5">
        <div className="flex justify-center gap-5 flex-col md:flex-row rounded overflow-hidden">
          <div className="w-full max-w-md text-center">
            <img src={image} alt="" className="w-full aspect-square rounded" />
          </div>
          <div className="flex flex-col justify-center w-full">
            <div className="mx-auto my-4 w-full">
              <div className="flex flex-col gap-5 w-full">
                <p className="text-md font-bold text-center mb-1">
                  {traitsWithPledges.length} sponsored trait
                  {traitsWithPledges.length > 1 && "s"}
                </p>
                {traitsWithPledges.map((traitTypeId) => {
                  const exampleTrait: TraitNameAndImageData = {
                    name: "",
                    traitId: nounSeed[traitTypeNamesById(traitTypeId)[0]],
                    traitTypeId: traitTypeId,
                    type: traitTypeNamesById(traitTypeId)[0],
                    imageData: {
                      filename: "",
                      data: "",
                    },
                  };
                  return (
                    <RequestCard
                      trait={exampleTrait}
                      pledges={pledgesForFOMOHead?.pledges}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleNoun;
