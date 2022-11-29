import { useMemo, useState } from "react";
import type { NextPage } from "next";
import useGetDonationsForUpcomingNoun from "../hooks/useGetDonationsForUpcomingNoun";
import RequestCard from "../components/RequestCard";
import Link from "next/link";
import ExampleNoun from "../components/ExampleNoun";
import { useIsMounted } from "../hooks";

const Home: NextPage = () => {
  const isMounted = useIsMounted();
  // Get donations pertaining to next noun
  const { nextAuctionDonations, nextAuctionId } =
    useGetDonationsForUpcomingNoun();
  const [filteredTraitType, setFilteredTraitType] = useState<number | null>();
  const orderedTraitTitles = [3,4,2,1]; // not showing backgrounds in tabs
  const traitTypes = ["backgrounds", "bodies", "accessories", "heads", "glasses"];

  if (!isMounted) return null;
  return (
    <div className="container mx-auto pb-10">
      {/* Intro description */}
      <div className="text-center py-2 max-w-lg mx-auto my-10">
        <h1 className="text-3xl font-bold text-serif mb-2">
          Sponsor Nouns. <br />
          Send money to charity.
        </h1>
        <p>
          Integer posuere erat a ante venenatis dapibus posuere velit aliquet.
          Cum sociis natoque penatibus et magnis dis parturient.
        </p>
        <Link href="/add">
          <a className="underline bold">Create a Request</a>
        </Link>
      </div>

      {/* Example rotator */}
      {nextAuctionDonations && (
        <ExampleNoun nextAuctionDonations={nextAuctionDonations} />
      )}
      <div className="text-center mt-10">
        <h2 className="text-3xl font-bold">Open sponsorships</h2>
        {/* TODO: Add countdown clock */}
        <p className="">
          Noun {nextAuctionId} available to mint in X hours, Y minutes
        </p>
      </div>

      {/* Filters */}
      <div className="justify-center mt-5 mb-10 select-none flex">
        {nextAuctionDonations &&
          orderedTraitTitles.map((traitType, index) => {
            const traitCount = Object.values(
              nextAuctionDonations[traitTypes[traitType]]
            ).length;
            return (
              <button
                key={index}
                className={`${
                  filteredTraitType === traitType
                    ? "bg-slate-500 text-white"
                    : "bg-slate-500/25 text-slate-500"
                } py-2 px-4 rounded-full mx-1 cursor-pointer text-white font-sans font-semibold text-sm mr-2 hover:bg-slate-200 disabled:opacity-75 disabled:cursor-auto`}
                onClick={() => {
                  setFilteredTraitType(traitType);
                }}
                disabled={traitCount === 0 || false}
              >
                {traitCount} {traitTypes[traitType]}
              </button>
            );
          })}
        {filteredTraitType && (
          <button
            onClick={() => setFilteredTraitType(null)}
            className="py-2 px-4 no-underline rounded-full text-slate-500 font-sans font-semibold text-sm border-red focus:outline-none active:shadow-none"
          >
            clear
          </button>
        )}
      </div>

      {/* Grid of sponsorships */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {nextAuctionDonations &&
          Object.entries(nextAuctionDonations).map(([traitType, traits]) => {
            const traitTypeId = traitTypes.indexOf(traitType);
            if (Object.values(traits).length == 0) return;
            if (filteredTraitType && traitTypeId != filteredTraitType) return;
            const grid = Object.values(traits)
              .filter((f) => f.trait.traitTypeId === traitTypeId)
              .map((request) => {
                return (
                  <RequestCard
                    trait={request.trait}
                    donations={request.donations}
                    key={request.trait.name}
                  />
                );
              });
            return grid;
          })}
      </div>
    </div>
  );
};

export default Home;
