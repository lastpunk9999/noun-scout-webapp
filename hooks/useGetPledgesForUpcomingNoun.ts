import { useMemo } from "react";
import { constants } from "ethers";
import { nounScoutContract } from "../config";
import { extractPledges } from "../utils";
import { PledgesByTraitType } from "../types";
import { useAppContext } from "../context/state";

export interface PledgesForUpcomingNoun {
  nextAuctionPledges: PledgesByTraitType;
  nextNonAuctionPledges: PledgesByTraitType;
  nextAuctionId: number;
  nextNonAuctionId: number;
}

export default function useGetPledgesForUpcomingNoun(): PledgesForUpcomingNoun {
  const {
    recipients,
    pledgesForUpcomingNoun: pledges,
    baseReimbursementBPS = 250,
    minReimbursement = constants.Zero,
    maxReimbursement = constants.Zero,
  } = useAppContext() ?? {};

  const nextAuctionPledges = useMemo(() => {
    if (!recipients || !pledges) return;
    return extractPledges(
      pledges.nextAuctionPledges,
      recipients,
      pledges.nextAuctionId,
      baseReimbursementBPS,
      minReimbursement,
      maxReimbursement
    );
  }, [pledges, recipients]);
  const nextNonAuctionPledges = useMemo(() => {
    if (!recipients || !pledges) return;
    if (pledges.nextNonAuctionedId > pledges.nextAuctionedId) return;
    return extractPledges(
      pledges.nextNonAuctionPledges,
      recipients,
      pledges.nextNonAuctionId,
      baseReimbursementBPS,
      minReimbursement,
      maxReimbursement
    );
  }, [pledges, recipients]);
  return {
    nextAuctionPledges,
    nextNonAuctionPledges,
    nextNonAuctionId: pledges && pledges.nextNonAuctionId,
    nextAuctionId: pledges && pledges.nextAuctionId,
  };
}
