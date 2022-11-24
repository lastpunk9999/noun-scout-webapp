import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAccount, useContractRead, useContractReads } from "wagmi";
import { nounSeekContract } from "../../config";
import NounWithMatches from "./NounWithMatches";

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
  
  console.log('matchData', matchData);

  if (!isConnected) return null;
  return (
    <div>
      {matchData.auctionedNounDonations && (
        <>
          <h1 className="text-3xl font-bold mb-2 text-center">Open Matches</h1>
          <NounWithMatches 
            nounId={matchData.auctionedNounId}      
            donations={matchData.auctionedNounDonations} 
          />
        </>
        )
      }
    </div>
  );
};

export default Match;
