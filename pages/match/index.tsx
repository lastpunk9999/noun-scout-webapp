import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAccount, useContractRead, useContractReads } from "wagmi";
import { Donation, RequestSeed } from "../../types";
import cx from "classnames";
import RequestCard from "../../components/RequestCard";
import { ethers, utils } from "ethers";
import { nounSeekContract } from "../../config";
import MatchItem from "./MatchItem";
import NounWithMatches from "./NounWithMatches";
import { extractDonations } from "../../utils";

const Match: NextPage = () => {
  const { isConnected, isConnecting } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnecting || !router) return;
    if (isConnected) return;
    router.push("/");
  }, [isConnected, isConnecting, router]);

  const matchData = useContractRead({
    address: nounSeekContract.address,
    abi: nounSeekContract.abi,
    functionName: 'donationsAndReimbursementForPreviousNoun',
  }).data;
  
  const auctionedNounDonationsList = matchData.auctionedNounDonations.map((donation, index) => { 
    const num = donation.toString();
    return num; 
  });
  
  if (!isConnected) return null;
  return (
    <div>
      {matchData.auctionedNounDonations && (
        <>
          <h1 className="text-3xl font-bold mb-2 text-center">Open Matches</h1>
          <NounWithMatches 
            nounId={matchData.auctionedNounId}      
            donations={matchData.auctionedNounDonations} 
            totalDonationsPerTrait={matchData.totalDonationsPerTrait} 
          />
        </>
      )}
      {matchData.nonAuctionedNounId < matchData.auctionedNounId && (
        <>
          <h1 className="text-3xl font-bold mb-2 text-center">Open Matches</h1>
          <NounWithMatches 
            nounId={matchData.nonAuctionedNounId}      
            donations={matchData.nonAuctionedNounDonations} 
            totalDonationsPerTrait={matchData.totalDonationsPerTrait} 
          />
        </>
      )}
    </div>
  );
};

export default Match;
