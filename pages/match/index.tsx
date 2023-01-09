import type { NextPage } from "next";
import NounWithMatches from "./NounWithMatches";
import { useAppContext } from "../../context/state";
import cx from "classnames";
import { constants, utils } from "ethers";
import { BigNumber } from "../../types";
import { useMemo } from "react";

const Match: NextPage = () => {
  const { donationsForMatchableNoun: matchData } = useAppContext() ?? {};

  const isNonAuctionedNoun =
    matchData?.nonAuctionedNounId < matchData?.auctionedNounId &&
    matchData?.nonAuctionedNounDonations
      ? true
      : false;

  const totalReimbursement = useMemo(() => {
    if (!matchData) return constants.Zero;
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
      {!totalReimbursement?.isZero() && (
        <p className="text-xl text-center">
          Earn{" "}
          <span className="whitespace-nowrap">
            Ξ {utils.formatEther(totalReimbursement)}
          </span>{" "}
          by matching
        </p>
      )}
      <div className={cx("mx-auto max-w-3xl flex flex-col gap-5 my-10")}>
        <NounWithMatches
          nounId={matchData.auctionedNounId}
          donations={matchData.auctionedNounDonations}
          reimbursements={matchData.reimbursementPerTrait}
        />

        {isNonAuctionedNoun && (
          <NounWithMatches
            nounId={matchData.nonAuctionedNounId}
            donations={matchData.nonAuctionedNounDonations}
            reimbursements={matchData.reimbursementPerTrait}
          />
        )}
      </div>
    </div>
  );
};

export default Match;
