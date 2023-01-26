import type { NextPage } from "next";
import NounWithMatches from "./NounWithMatches";
import { useAppContext } from "../../context/state";
import cx from "classnames";
import { constants, utils } from "ethers";
import { BigNumber } from "../../types";
import { useMemo } from "react";

const Match: NextPage = () => {
  const { pledgesForMatchableNoun: matchData } = useAppContext() ?? {};

  const isNonAuctionedNoun =
    matchData?.nonAuctionedNounId < matchData?.auctionedNounId &&
    matchData?.nonAuctionedNounPledges
      ? true
      : false;

  const auctionedTotalReimbursement = useMemo(() => {
    if (!matchData) return constants.Zero;
    return matchData.auctionNounTotalReimbursement.reduce(
      (reimbursement: BigNumber, total: BigNumber, i: number) => {
        return total.add(reimbursement);
      }
    );
  }, [matchData]);

  const nonAuctionedTotalReimbursement = useMemo(() => {
    if (!matchData) return constants.Zero;
    return matchData.nonAuctionNounTotalReimbursement.reduce(
      (reimbursement: BigNumber, total: BigNumber, i: number) => {
        return total.add(reimbursement);
      }
    );
  }, [matchData]);

  if (!matchData) return null;

  return (
    <div className="px-4">
      <h1 className="text-5xl font-bold font-serif mb-2 text-center">
        Unsent Donations
      </h1>
      {!auctionedTotalReimbursement?.isZero() &&
        !nonAuctionedTotalReimbursement.isZero() && (
          <>
            <p className="text-xl text-center">
              ETH has been pledged to non-profits and you can help it get to
              them.
              <br />
              Settle these requests and get reimbursed{" "}
              <span className="whitespace-nowrap">
                {utils.formatEther(
                  auctionedTotalReimbursement.add(
                    nonAuctionedTotalReimbursement
                  )
                )}{" "}
                ETH
              </span>
            </p>
          </>
        )}
      <div className={cx("mx-auto max-w-3xl flex flex-col gap-5 my-10")}>
        <NounWithMatches
          nounId={matchData.auctionedNounId}
          pledges={matchData.auctionedNounPledges}
          reimbursements={matchData.auctionNounTotalReimbursement}
        />

        {isNonAuctionedNoun && (
          <NounWithMatches
            nounId={matchData.nonAuctionedNounId}
            pledges={matchData.nonAuctionedNounPledges}
            reimbursements={matchData.nonAuctionNounTotalReimbursement}
          />
        )}
      </div>
    </div>
  );
};

export default Match;
