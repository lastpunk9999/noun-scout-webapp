import Link from "next/link";
import { BigNumber, utils, constants } from "ethers";
import { useAppContext } from "../context/state";
import { useEffect, useMemo } from "react";
import { effectiveBPS } from "../utils";
import { BaseNextRequest } from "next/dist/server/base-http";
type TodayBannerProps = {};

const TodayBanner = (props: TodayBannerProps) => {
  const {
    pledgesForNounOnAuction: matchData,
    baseReimbursementBPS,
    minReimbursement,
    maxReimbursement,
  } = useAppContext();

  const totalAuctionMatches = useMemo(() => {
    if (!matchData?.currentAuctionPledges) return constants.Zero;
    const total = matchData.currentAuctionPledges
      .flat(Infinity)
      .reduce((total: BigNumber, pledge: BigNumber) => {
        return total.add(pledge);
      }, constants.Zero);
    const reimbursementBPS = effectiveBPS(
      baseReimbursementBPS,
      minReimbursement,
      maxReimbursement,
      total
    );
    return total
      .mul(BigNumber.from("10000").sub(reimbursementBPS))
      .div("10000");
  }, [matchData, baseReimbursementBPS, minReimbursement, maxReimbursement]);

  const totalNonAuctionMatches = useMemo(() => {
    if (!matchData?.prevNonAuctionPledges) return constants.Zero;
    const total = matchData.prevNonAuctionPledges
      .flat(Infinity)
      .reduce((total: BigNumber, pledge: BigNumber) => {
        return total.add(pledge);
      }, constants.Zero);
    const reimbursementBPS = effectiveBPS(
      baseReimbursementBPS,
      minReimbursement,
      maxReimbursement,
      total
    );
    return total
      .mul(BigNumber.from("10000").sub(reimbursementBPS))
      .div("10000");
  }, [matchData, baseReimbursementBPS, minReimbursement, maxReimbursement]);

  const hasAuctionMatches = useMemo(
    () => !totalAuctionMatches.isZero(),
    [totalAuctionMatches]
  );

  const hasNonAuctionMatches = useMemo(
    () => !totalNonAuctionMatches.isZero(),
    [totalNonAuctionMatches]
  );

  const totalDonations = useMemo(
    () => utils.formatEther(totalAuctionMatches.add(totalNonAuctionMatches)),
    [totalAuctionMatches, totalNonAuctionMatches]
  );

  if (!hasAuctionMatches && !hasNonAuctionMatches) return;
  const plural = hasAuctionMatches && hasNonAuctionMatches;
  return (
    <Link href="/today">
      <a className="bg-warm p-2 text-center hover:cursor-pointer no-underline block font-normal">
        <p className="slate-200">
          Today's Noun{plural && "s"} ha{plural ? "ve" : "s"} matches!{" "}
          <span className="underline slate-200">
            {totalDonations} ETH is queued for causes
          </span>
        </p>
      </a>
    </Link>
  );
};

export default TodayBanner;
