import { getNounData, ImageData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import { BigNumber, utils } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import { nounsTokenContract } from "../config";
import useFakeNoun from "../hooks/useFakeNoun";
import useGetDonationsForNextNoun from "../hooks/useGetDonationsForNextNoun";
import MatchItem from "../pages/match/MatchItem";
import { Donation, DonationsByTraitType, NounSeed, TraitAndDonations, TraitNameAndImageData } from "../types";
import RequestCard from "./RequestCard";

type ExampleNounProps = {
  nextAuctionDonations: DonationsByTraitType;
}

const ExampleNoun = (props: ExampleNounProps) => {   
    const [nounSeed, setNounSeed] = useState<NounSeed>({
        background: Math.floor(Math.random() * 2),
        body: Math.floor(Math.random() * 4),
        accessory: Math.floor(Math.random() * 4),
        head: Math.floor(Math.random() * 4),
        glasses: Math.floor(Math.random() * 4),
    });
    const [donationsForFOMOHead, setDonationsForFOMOHead] = useState<TraitAndDonations>(props.nextAuctionDonations.heads[0]);
    
    const buildNounSeed = () => {
      const newSeed = {} as NounSeed;
      newSeed.background = Math.floor(Math.random() * 2);
      newSeed.body = Math.floor(Math.random() * ImageData.images.bodies.length);
      newSeed.accessory = Math.floor(Math.random() * ImageData.images.accessories.length);
      newSeed.head = Math.floor(Math.random() * ImageData.images.heads.length);
      newSeed.glasses = Math.floor(Math.random() * ImageData.images.glasses.length);
      console.log('newSeed', newSeed);
      return newSeed;
    };

    const buildDonationsForFOMOHead = () => {
      const donations = Object.values(props.nextAuctionDonations.heads);
      const length = donations.length;
      setDonationsForFOMOHead(donations[Math.floor(Math.random() * length)]);

    };

    useEffect(() => {
      const timerId = setInterval( () => {
        setNounSeed(buildNounSeed());
        buildDonationsForFOMOHead();
      }, 5000);
      return () => {
        clearInterval(timerId);
      };
    }, [props.nextAuctionDonations]);

    // Get image data for next auctioned Noun
    const { src } = useFakeNoun(props.nextAuctionDonations, nounSeed);

    // Find donations that match the FOMO Noun head
    // const donationsForFOMOHead = props.nextAuctionDonations.heads[0];
    const exampleTrait: TraitNameAndImageData = {
      name: "",
      traitId: nounSeed.head,
      traitTypeId: 3,
      type: "head",
      imageData: {
        filename: "",
        data: ""
      }
    }

    const totalDonationsForFOMOHead = donationsForFOMOHead?.donations
    .map((d) => d.amount)
    .reduce((m, d) => m.add(d));

  return (
    <>
      <div className="text-center my-10">
        <h2 className="text-3xl font-bold">How it works</h2>
        <p>If this Noun were minted, {!totalDonationsForFOMOHead ? "no funds would be sent to non-profits." : `${utils.formatEther(totalDonationsForFOMOHead)} ETH would be sent to non-profits.`}</p>
      </div>
      <div className="mb-20">
        <div className="flex justify-center gap-10 flex-col md:flex-row rounded overflow-hidden shadow-lg p-3">
          <div className="w-md">
            <img src={src} alt="" className="w-full aspect-square rounded" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="max-w-4xl mx-auto my-4 p-5 border border-slate-200 pb-4 bg-slate-100">	
              <div className="flex flex-col">
                <RequestCard 
                  trait={exampleTrait}
                  donations={donationsForFOMOHead?.donations}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}

export default ExampleNoun;
