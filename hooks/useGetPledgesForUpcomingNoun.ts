import { useMemo } from "react";
import { nounScoutContract } from "../config";
import { extractPledges } from "../utils";
import { PledgesByTraitType } from "../types";
import { useAppContext } from "../context/state";

export interface PledgesForUpcomingNoun {
  nextAuctionPledges: PledgesByTraitType;
  nextAuctionId: number;
}

export default function useGetPledgesForUpcomingNoun(): PledgesForUpcomingNoun {
  const { recipients, pledgesForUpcomingNoun: pledges } = useAppContext() ?? {};

  return {
    nextAuctionPledges: useMemo(() => {
      if (!recipients || !pledges) return;
      return extractPledges(pledges.nextAuctionPledges, recipients, 0);
    }, [pledges, recipients]),
    nextAuctionId: pledges && pledges.nextAuctionId,
  };
}
