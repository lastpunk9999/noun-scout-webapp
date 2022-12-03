import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { nounSeekContract } from "../../config";
import NounWithMatches from "./NounWithMatches";
import { useIsMounted } from "../../hooks";
import { useAppContext } from "../../context/state";

const Match: NextPage = () => {
  const { isConnected, isConnecting } = useAccount();
  const [,matchData] = useAppContext() ?? []

  // const isMounted = useIsMounted();
  if (!matchData) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-center">Open Matches</h1>
      <NounWithMatches
        nounId={matchData.auctionedNounId}
        donations={matchData.auctionedNounDonations}
        reimbursements={matchData.reimbursementPerTrait}
      />
      {matchData.nonAuctionedNounId === matchData.auctionedNounId - 1 &&
        matchData.nonAuctionedNounDonations && (
          <>
            <NounWithMatches
              nounId={matchData.nonAuctionedNounId}
              donations={matchData.nonAuctionedNounDonations}
              reimbursements={matchData.reimbursementPerTrait}
            />
          </>
        )}
    </div>
  );
};

export default Match;
