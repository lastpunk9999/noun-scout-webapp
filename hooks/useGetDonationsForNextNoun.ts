import { useMemo } from "react";
import { useContractReads } from "wagmi";
import { nounSeekContract } from "../config";
import { extractDonations } from "../utils";
import { DonationsByTraitType } from "../types";

export interface DonationsForNextNoun {
  nextAuctionDonations: DonationsByTraitType;
  nextAuctionedId: number;
}

export default function useGetDonationsForNextNoun(): DonationsForNextNoun {
  const { data } = useContractReads({
    contracts: [
      {
        address: nounSeekContract.address,
        abi: nounSeekContract.abi,
        functionName: "donationsForNextNoun",
      },
      {
        address: nounSeekContract.address,
        abi: nounSeekContract.abi,
        functionName: "donees",
      },
    ],
  });

  const [donations, donees] = data || [];
  
  return {
    nextAuctionDonations: data && useMemo(
      () => extractDonations(donations.nextAuctionDonations, donees),
      [donations, donees]
    ),
    nextAuctionedId: data && donations.nextAuctionedId,
  };
}
