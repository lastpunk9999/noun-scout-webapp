import { useEffect, useState } from "react";
import cx from "classnames";
import { Donation, RequestSeed } from "../../types";
import RequestCard from "../../components/RequestCard";
import useNoun from "../../hooks/useNoun";
import { BigNumber, ethers, utils } from "ethers";
import { useContractRead } from "wagmi";
import { nounsTokenContract } from "../../config";
import MatchItem from "./MatchItem";

type NounWithMatchesProps = {
    nounId: number;
    donations: readonly [
        readonly BigNumber[], 
        readonly BigNumber[], 
        readonly BigNumber[], 
        readonly BigNumber[], 
        readonly BigNumber[]
    ];
    totalDonationsPerTrait: readonly [
      BigNumber, 
      BigNumber, 
      BigNumber, 
      BigNumber, 
      BigNumber
    ];
}

const NounWithMatches = (props: NounWithMatchesProps) => {
  const nounSeed = useContractRead({
    address: nounsTokenContract.address,
    abi: nounsTokenContract.abi,
    functionName: 'seeds',
    args: [BigNumber.from(props.nounId)]
  }).data;

  let traitDonationCount = 0;
  console.log('props.totalDonationsPerTrait', props.totalDonationsPerTrait)

  return (
    <div className="max-w-4xl mx-auto my-4 p-5 border border-slate-200 pb-4 bg-slate-100">	
      <div className="flex flex-col">
        <h3 className="text-lg font-bold">Noun {props.nounId}</h3>
        <img src={`https://noun.pics/${props.nounId}.svg`} className="w-40" />
      </div>
      {props.totalDonationsPerTrait.map((donation, index) => {
        console.log('nounId', props.nounId, donation, donation.toString());
        if (utils.formatEther(donation) !== '0.0') {
          const donationData: Donation = {
            to: index,
            amount: donation
          }
          // handleHasDonation(true);
          traitDonationCount = traitDonationCount + 1;
          return (
            <MatchItem 
              traitTypeId={index}
              traitId={nounSeed[index]}
              donation={donationData}
              nounSeed={nounSeed}
            />
          );
        } 
      })}
      {traitDonationCount === 0 && (
        <p className="text-center">No matches</p>
      )}
    </div>
    
  );
}

export default NounWithMatches;
