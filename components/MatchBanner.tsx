import Link from "next/link";
import { BigNumber, utils } from "ethers";
import { useAppContext } from "../context/state";
import { useEffect, useMemo } from "react";

type MatchBannerProps = {

}

const MatchBanner = (props: MatchBannerProps) => {
  const [,matchData] = useAppContext() ?? [];

  const totalReimbursement = useMemo(()=> {
    if (!matchData) return BigNumber.from("0");
    return matchData.reimbursementPerTrait.reduce((reimbursement: BigNumber, total: BigNumber) => {
      return total.add(reimbursement)
    })
  },[matchData])

  if (totalReimbursement.isZero()) return;

  return (
    <div className="bg-blue-500 p-2 text-center">
      <p className="text-white">Noun {matchData.auctionedNounId} has a request to be matched! earn Ξ  {utils.formatEther(totalReimbursement)} by matching it. <Link href="/match"><a className="underline uppercase font-bold text-white">Match</a></Link></p>
    </div>
  );

}

export default MatchBanner;
