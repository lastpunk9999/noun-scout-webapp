import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAccount, useContractRead, useContractReads } from "wagmi";
import { nounSeekContract } from "../../config";
import NounWithMatches from "./NounWithMatches";
import { useIsMounted } from "../../hooks";

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
    functionName: 'donationsForMatchableNoun',
  }).data;
  // const isMounted = useIsMounted();
  if (!isConnected || !matchData) return null;
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-center">Open Matches</h1>
      {matchData.auctionedNounDonations && (
        <>
          <NounWithMatches
            nounId={matchData.auctionedNounId}
            donations={matchData.auctionedNounDonations}
          />
        </>
        )
      }
      {matchData.nonAuctionedNounId === matchData.auctionedNounId -1 && matchData.nonAuctionedNounDonations && (
        <>
          <NounWithMatches
            nounId={matchData.nonAuctionedNounId}
            donations={matchData.nonAuctionedNounDonations}
          />
        </>
        )
      }
    </div>
  );
};

export default Match;
