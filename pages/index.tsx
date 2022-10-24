import { useMemo } from "react";
import type { NextPage } from "next";
import { useContractRead, useProvider } from "wagmi";

import { utils } from "ethers";

import { ImageData } from "@nouns/assets";
import UserRequests from "../components/UserRequests";
import { DonationsForNextNoun, Donnee } from "../types";
import { nounSeekContract } from "../config";
import useNoun from "../hooks/useNoun";

const nounImages = ImageData.images;

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
  const { src, seed, isNounLoading } = useNoun(nextAuctionedId);

  const donationsByTrait = nextAuctionDonations.reduce(
    (obj, traitsArray, index) => {
      const traitsObj = traitsArray.reduce(
        (traitsObj, donateesArray, index) => {
          const nonZeroDonations = donateesArray
            .map((donation, index) => {
              if (donation.eq("0")) return;
              return {
                name: donees[index].name,
                donation,
              };
            })
            .filter((n) => n);
          if (nonZeroDonations.length > 0) {
            traitsObj[index] = nonZeroDonations;
          }
          return traitsObj;
        },
        {}
      );

      if (index == 0) obj.background = traitsObj;
      if (index == 1) obj.body = traitsObj;
      if (index == 2) obj.accessory = traitsObj;
      if (index == 3) obj.head = traitsObj;
      if (index == 4) obj.glasses = traitsObj;
      return obj;
    },
    {}
  );

  if (seed) seed.head = 0;

  // Find donations that match the FOMO Noun head
  const donationsForFOMOHead =
    seed === undefined || donationsByTrait.head[seed.head] === undefined
      ? []
      : donationsByTrait.head[seed.head];

  const totalDonationsForFOMOHead =
    donationsForFOMOHead.length == 0
      ? undefined
      : donationsForFOMOHead.map((d) => d.donation).reduce((m, d) => m.add(d));

  const donationsForHead =
    Object.keys(donationsByTrait.head).length === 0
      ? undefined
      : Object.entries(donationsByTrait.head).map(([traitId, donations]) => {
          const name = nounImages.heads[Number(traitId)].filename.replace(
            "head-",
            ""
          );
          return {
            name,
            donations,
          };
        });
  console.log(!!donationsForHead);
  return (
    <div>
      <img src={src} />
      <br />
      If this Noun were minted,{" "}
      {!totalDonationsForFOMOHead ? (
        <>no funds would be sent to non-profits</>
      ) : (
        <>
          {utils.formatEther(totalDonationsForFOMOHead)} ETH would be sent to
          non-profits
        </>
      )}
      <ul>
        {donationsForFOMOHead.map((data) => {
          return (
            <li>
              <b>{utils.formatEther(data.donation)} ETH</b> to {data.name}
            </li>
          );
        })}
      </ul>
      <br />
      <h2>Current Requests</h2>
      {donationsForHead && (
        <>
          <h3>Head</h3>
          <ul>
            {donationsForHead.map((head) => {
              return (
                <li>
                  <ul>
                    {head.name}
                    {head.donations.map((data) => {
                      return (
                        <li>
                          <b>{utils.formatEther(data.donation)} ETH</b> to{" "}
                          {data.name}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default Home;
