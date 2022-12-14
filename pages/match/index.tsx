import type { NextPage } from "next";
import NounWithMatches from "./NounWithMatches";
import { useAppContext } from "../../context/state";
import cx from "classnames";
import { BigNumber, utils } from "ethers";
import { useMemo } from "react";

const Match: NextPage = () => {
  const [, matchData] = useAppContext() ?? [];

  const isNonAuctionedNoun =
    matchData.nonAuctionedNounId === matchData.auctionedNounId - 1 &&
    matchData.nonAuctionedNounDonations
      ? true
      : false;

  const totalReimbursement = useMemo(() => {
    if (!matchData) return BigNumber.from("0");
    return matchData.reimbursementPerTrait.reduce(
      (reimbursement: BigNumber, total: BigNumber) => {
        return total.add(reimbursement);
      }
    );
  }, [matchData]);
  if (!matchData) return null;

  return (
    <div className="px-4">
      <h1 className="text-5xl font-bold font-serif mb-2 text-center">
        Open Matches
      </h1>
      <p className="text-xl text-center">
        Earn{" "}
        <span className="whitespace-nowrap">
          Ξ {utils.formatEther(totalReimbursement)}
        </span>{" "}
        by matching
      </p>
      <div
        className={cx(
          isNonAuctionedNoun
            ? "lg:flex lg:flex-row gap-10 lg:max-w-5xl"
            : "max-w-lg",
          "mx-auto"
        )}
      >
        <NounWithMatches
          nounId={matchData.auctionedNounId}
          donations={matchData.auctionedNounDonations}
          reimbursements={matchData.reimbursementPerTrait}
        />

        {isNonAuctionedNoun && (
          <>
            <NounWithMatches
              nounId={matchData.nonAuctionedNounId}
              donations={matchData.nonAuctionedNounDonations}
              reimbursements={matchData.reimbursementPerTrait}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Match;
