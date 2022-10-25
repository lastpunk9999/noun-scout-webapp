import { useMemo } from "react";
import { useContractReads } from "wagmi";
import { nounSeekContract } from "../config";
import { extractDonations } from "../utils";

export default function useGetDonationsForNextNoun() {
  const { data } = useContractReads({
    contracts: [
      {
        functionName: "donationsForNextNoun",
        ...nounSeekContract,
      },
      {
        ...nounSeekContract,
        functionName: "donees",
      },
    ],
  });
  const [donations, donees] = data;

  return {
    nextAuctionDonations: useMemo(
      () => extractDonations(donations.nextAuctionDonations, donees),
      [donations, donees]
    ),
    nextAuctionedId: donations.nextAuctionedId,
  };
}
