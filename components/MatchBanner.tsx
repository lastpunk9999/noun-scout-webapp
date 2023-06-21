import Link from "next/link";
import { BigNumber, utils, constants } from "ethers";
import { useAppContext } from "../context/state";
import { useEffect, useMemo } from "react";

type MatchBannerProps = {};

const MatchBanner = (props: MatchBannerProps) => {
  const { pledgesForMatchableNoun: matchData } = useAppContext() ?? {};

  const auctionedTotalReimbursement = useMemo(() => {
    if (!matchData) return constants.Zero;
    return matchData.auctionNounTotalReimbursement.reduce(
      (total: BigNumber, reimbursement: BigNumber) => {
        return total.add(reimbursement);
      }
    );
  }, [matchData]);

  const nonAuctionedTotalReimbursement = useMemo(() => {
    if (!matchData) return constants.Zero;

    return matchData.nonAuctionNounTotalReimbursement.reduce(
      (total: BigNumber, reimbursement: BigNumber) => {
        return total.add(reimbursement);
      }
    );
  }, [matchData]);

  const hasAuctionedReimbursement = useMemo(
    () => !auctionedTotalReimbursement.isZero(),
    [auctionedTotalReimbursement]
  );
  const hasNoneAuctionedReimbursement = useMemo(
    () => !nonAuctionedTotalReimbursement.isZero(),
    [nonAuctionedTotalReimbursement]
  );

  const totalReimbursement = useMemo(
    () =>
      utils.formatEther(
        auctionedTotalReimbursement.add(nonAuctionedTotalReimbursement)
      ),
    [auctionedTotalReimbursement, nonAuctionedTotalReimbursement]
  );

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
          ✨ Donations are waiting to be sent to non-profits. You can earn{" "}
          <span className="whitespace-nowrap font-bold">
            {totalReimbursement} ETH
          </span>{" "}
          by <span className="underline text-white">helping out</span>
        </p>
      </a>
    </Link>
  );
};

export default MatchBanner;
