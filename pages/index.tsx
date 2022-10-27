import { useMemo } from "react";
import type { NextPage } from "next";
import { useContractRead, useProvider } from "wagmi";

import { utils } from "ethers";

import { ImageData } from "@nouns/assets";

import { nounSeekContract } from "../config";
import useFakeNoun from "../hooks/useFakeNoun";
import useGetDonationsForNextNoun from "../hooks/useGetDonationsForNextNoun";

const nounImages = ImageData.images;

const Home: NextPage = () => {
  // Get donations pertaining to next noun
  const { nextAuctionDonations, nextAuctionedId } =
    useGetDonationsForNextNoun();

  // Get seed and image data for next auctioned Noun
  const { src, seed, isNounLoading } = useFakeNoun(nextAuctionDonations);

  // Find donations that match the FOMO Noun head
  const donationsForFOMOHead = nextAuctionDonations?.heads[seed?.head];

  const totalDonationsForFOMOHead = donationsForFOMOHead?.donations
    .map((d) => d.amount)
    .reduce((m, d) => m.add(d));

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
        {donationsForFOMOHead?.donations.map((data) => {
          return (
            <li key={data.to}>
              <b>{utils.formatEther(data.amount)} ETH</b> to {data.to}
            </li>
          );
        })}
      </ul>
      <br />
      <h2>Requests for Noun {nextAuctionedId}</h2>
      {Object.entries(nextAuctionDonations).map(([traitType, traits]) => {
        if (Object.values(traits).length == 0) return;
        return (
          <>
            <h3>{traitType}</h3>

            {Object.values(traits).map((request) => {
              return (
                <>
                  <b>{request.trait.name}</b>
                  <ul>
                    {request.donations.map((data) => {
                      return (
                        <li key={data.to}>
                          <b>{utils.formatEther(data.amount)} ETH</b> to{" "}
                          {data.to}
                        </li>
                      );
                    })}
                  </ul>
                </>
              );
            })}
          </>
        );
      })}
    </div>
  );
};

export default Home;
