import Link from "next/link";
import { BigNumber, utils } from "ethers";

type MatchBannerProps = {
  
}

const MatchBanner = (props: MatchBannerProps) => {
  return (
    <div className="bg-blue-500 p-2 text-center">
      <p className="text-white">Noun 500 has a request to be matched! earn 0.35 eth by matching it. <Link href="/match" className="underline uppercase">Match</Link></p>
    </div>
  );
}

export default MatchBanner;
