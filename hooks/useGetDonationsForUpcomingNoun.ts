import { useMemo } from "react";
import { useContractRead } from "wagmi";
import { nounSeekContract } from "../config";
import { extractDonations } from "../utils";
import { DonationsByTraitType } from "../types";
import { useAppContext } from "../context/state";

export interface DonationsForUpcomingNoun {
  nextAuctionDonations: DonationsByTraitType;
  nextAuctionId: number;
}

export default function useGetDonationsForUpcomingNoun(): DonationsForUpcomingNoun {
  const [donees] = useAppContext() ?? [];

  const donations = useContractRead({
    address: nounSeekContract.address,
    abi: nounSeekContract.abi,
    functionName: "donationsForUpcomingNoun",
  }).data;

  return {
    nextAuctionDonations: useMemo(() => {
      if (!donees || !donations) return;
      return extractDonations(donations.nextAuctionDonations, donees);
    }, [donations, donees]),
    nextAuctionId: donations && donations.nextAuctionId,
  };
}
