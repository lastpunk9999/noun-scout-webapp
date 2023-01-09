import Link from "next/link";
import { BigNumber, utils, constants } from "ethers";
import { useAppContext } from "../context/state";
import { useEffect, useMemo } from "react";

type MatchBannerProps = {};

const MatchBanner = (props: MatchBannerProps) => {
  const { donationsForMatchableNoun: matchData } = useAppContext() ?? {};

  const totalReimbursement = useMemo(() => {
    if (!matchData) return constants.Zero;
    return matchData.reimbursementPerTrait.reduce(
      (reimbursement: BigNumber, total: BigNumber) => {
        return total.add(reimbursement);
      }
    );
  }, [matchData]);

  if (totalReimbursement.isZero()) return;

  return (
    <Link href="/match">
      <a className="bg-blue-500 p-2 text-center hover:cursor-pointer block">
        <p className="text-white">
          Noun {matchData.auctionedNounId} has a request to be matched! earn{" "}
          <span className="whitespace-nowrap">
            Ξ {utils.formatEther(totalReimbursement)}
          </span>{" "}
          by matching it.{" "}
          <span className="underline uppercase font-bold text-white">
            Match
          </span>
        </p>
      </a>
    </Link>
  );
};

export default MatchBanner;
