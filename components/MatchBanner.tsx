import Link from "next/link";
import { BigNumber, utils } from "ethers";
import { useAppContext } from "../context/state";
import { useEffect } from "react";

type MatchBannerProps = {

}

const MatchBanner = (props: MatchBannerProps) => {
  const [,matchData] = useAppContext() ?? [];
  if (!matchData) return;
  let totalReimbursement = BigNumber.from(0);
  const countTotalReimbursments = () => matchData.reimbursementPerTrait.map((reimbursement: BigNumber, i) => {
    if (reimbursement && !reimbursement.isZero()) {
      totalReimbursement = totalReimbursement.add(reimbursement);
    }
    return
  });

  countTotalReimbursments();

  if (matchData.auctionedNounDonations && !totalReimbursement.isZero()) {
    return (
      <div className="bg-blue-500 p-2 text-center">
        <p className="text-white">Noun {matchData.auctionedNounId} has a request to be matched! earn Ξ  {utils.formatEther(totalReimbursement)} by matching it. <Link href="/match"><a className="underline uppercase font-bold">Match</a></Link></p>
      </div>
    );
  }
}

export default MatchBanner;
