import { useMemo, useState } from "react";
import type { NextPage } from "next";
import { useContractRead, useProvider } from "wagmi";
import { utils } from "ethers";
import { ImageData } from "@nouns/assets";
import { nounSeekContract } from "../config";
import useFakeNoun from "../hooks/useFakeNoun";
import useGetDonationsForNextNoun from "../hooks/useGetDonationsForNextNoun";
import RequestCard from "../components/RequestCard";

const Home: NextPage = () => {
  // Get donations pertaining to next noun
  const { nextAuctionDonations, nextAuctionedId } =
    useGetDonationsForNextNoun();

  // Get seed and image data for next auctioned Noun
  const { src, seed, isNounLoading } = useFakeNoun(nextAuctionDonations);

  // Find donations that match the FOMO Noun head
  const donationsForFOMOHead = nextAuctionDonations?.heads[seed?.head];

  const totalDonationsForFOMOHead = donationsForFOMOHead?.donations
    .map((d) => d.amount)
    .reduce((m, d) => m.add(d));

  const [filteredTraitType, setFilteredTraitType] = useState<string | null>();

  return (
    <div className="container mx-auto pb-10">
      {/* Intro description */}
      <div className="text-center py-2 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-2">Sponsor Nouns. <br />Send money to charity.</h1>
        <p>Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cum sociis natoque penatibus et magnis dis parturient.</p>
        <a href="" className="underline bold">Create a Request</a>
      </div>

      {/* How it works */}
      <div className="text-center my-10">
        <h2 className="text-3xl font-bold">How it works</h2>
        <p>If this Noun were minted, {!totalDonationsForFOMOHead ? "no funds would be sent to non-profits." : `${utils.formatEther(totalDonationsForFOMOHead)} ETH would be sent to non-profits.`}</p>
      </div>
      {/* Example rotator */}
      <div className="mb-20">
        {/* Slide */}
        <div className="flex justify-center gap-10 flex-col md:flex-row rounded overflow-hidden shadow-lg p-3">
          <div className="w-md">
            <img src={src} alt="" className="w-full aspect-square rounded" />
          </div>
          <div className="flex flex-col justify-center">
            {/* Request component */}
            {totalDonationsForFOMOHead && (
              <RequestCard 
                  traitType="traitType" 
                  traitName="request.trait.name"
                  donations={donationsForFOMOHead?.donations}x
                />
            )}
          </div>
        </div>
      </div>

      <div className="text-center mt-10">
        <h2 className="text-3xl font-bold">Open sponsorships</h2>
        <p className="">{nextAuctionedId} Noun 500 available to mint in X hours, Y minutes</p>
      </div>
      {/* Filters */}
      <div className="justify-center mt-5 mb-10 select-none flex">
        <button onClick={() => setFilteredTraitType('heads')} className="py-2 px-4 no-underline rounded-full text-white font-sans font-semibold text-sm border-blue bg-slate-900 hover:text-white hover:bg-blue-light focus:outline-none active:shadow-none mr-2">X Heads</button>
        <button onClick={() => setFilteredTraitType('glasses')} className="py-2 px-4 no-underline rounded-full text-white font-sans font-semibold text-sm border-orange bg-slate-900 hover:text-white hover:bg-orange-light focus:outline-none active:shadow-none mr-2">Y Glasses</button>
        <button onClick={() => setFilteredTraitType('accessories')} className="py-2 px-4 no-underline rounded-full text-white font-sans font-semibold text-sm border-red bg-slate-900 hover:text-white hover:bg-red-light focus:outline-none active:shadow-none mr-2">Z Accessories</button>	
        <button onClick={() => setFilteredTraitType('bodies')} className="py-2 px-4 no-underline rounded-full text-white font-sans font-semibold text-sm border-red bg-slate-900 hover:text-white hover:bg-red-light focus:outline-none active:shadow-none">ZZ Bodies</button>	
        {filteredTraitType && (
          <button onClick={() => setFilteredTraitType(null)} className="py-2 px-4 no-underline rounded-full text-slate-500 font-sans font-semibold text-sm border-red focus:outline-none active:shadow-none">clear</button>	
        )}
      </div>
      {/* Grid of sponsorships */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Object.entries(nextAuctionDonations).map(([traitType, traits]) => {
          if (Object.values(traits).length == 0) return;
          if (filteredTraitType && traitType != filteredTraitType) return;
          return (
            <>              
              {Object.values(traits).map((request) => {
                return (
                  <RequestCard 
                    traitType={traitType} 
                    traitName={request.trait.name}  
                    donations={request.donations}
                    key={request.trait.name}
                  />
                );
              })}
            </>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
