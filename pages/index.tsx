import { useMemo } from "react";
import type { NextPage } from "next";
import { useContractRead, useProvider } from "wagmi";

import { utils } from "ethers";

import nounSeekABI from "../abi/nounSeekABI";
import UserRequests from "../components/UserRequests";
import { DonationsForNextNoun, Donnee } from "../types";
import { nounSeekContract } from "../config";
import useNoun from "../hooks/useNoun";

const Home: NextPage = () => {
  // Get donations pertaining to next noun
  const {
    data: donationsForNextNoun,
  }: { donationsForNextNoun: DonationsForNextNoun } = useContractRead({
    ...nounSeekContract,
    functionName: "donationsForNextNoun",
  });

  // Get list of Donees
  const { data: donees }: { donees: Array<Donnee> } = useContractRead({
    ...nounSeekContract,
    functionName: "donees",
  });

  const { nextAuctionedId, nextAuctionDonations } = donationsForNextNoun;

  // Get seed and image data for next auctioned Noun
  const { src, seed } = useNoun(nextAuctionedId);

  // Find donations that match the next Noun head
  const donationsForNextHead = !seed
    ? []
    : nextAuctionDonations[3][seed.head]
        .map((donation, index) => {
          if (donation.eq(0)) return;
          return {
            name: donees[index].name,
            donation,
          };
        })
        .filter((d) => d);

  return (
    <div>
      <img src={src} />
      <br />
      <ul>
        {donationsForNextHead.length === 0 && <li>No Donations</li>}
        {donationsForNextHead.map((data) => {
          return (
            <li>
              <b>{utils.formatEther(data.donation)} ETH</b> to {data.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Home;
