import Link from "next/link";
import { BigNumber, utils, constants } from "ethers";
import { useAppContext } from "../context/state";
import { useEffect, useMemo } from "react";

type MatchBannerProps = {};

const MatchBanner = (props: MatchBannerProps) => {
  const { pledgesForMatchableNoun: matchData } = useAppContext() ?? {};
  console.log({ matchData });
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

  const hasAuctionedReimbursement = !auctionedTotalReimbursement.isZero();
  const hasNoneAuctionedReimbursement =
    !nonAuctionedTotalReimbursement.isZero();

  if (!hasAuctionedReimbursement && !hasNoneAuctionedReimbursement) return;

  return (
    <Link href="/settle">
      <a className="bg-blue-500 p-2 text-center hover:cursor-pointer block font-normal">
        <p className="text-white">
          {/* {hasAuctionedReimbursement && <>Noun {matchData.auctionedNounId} </>}
          {hasAuctionedReimbursement && hasNoneAuctionedReimbursement && (
            <>and </>
          )}
          {hasNoneAuctionedReimbursement && (
            <>Noun {matchData.nonAuctionedNounId} </>
          )}
          have requested traits! */}
          Donations are waiting to be sent to non-profits. You can earn{" "}
          <span className="whitespace-nowrap font-bold">
            {utils.formatEther(auctionedTotalReimbursement)} ETH
          </span>{" "}
          by <span className="underline text-white">helping out</span>
        </p>
      </a>
    </Link>
  );
};

export default MatchBanner;
