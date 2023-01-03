import { useState } from "react";
import type { NextPage } from "next";
import useGetDonationsForUpcomingNoun from "../hooks/useGetDonationsForUpcomingNoun";
import RequestCard from "../components/RequestCard";
import Link from "next/link";
import Modal from "../components/Modal";
import { Request, TraitAndDonations } from "../types";
import cx from "classnames";

import Explainer from "../components/Explainer";
import CountdownClock from "../components/CountdownClock";

const Hero = () => {
  return (
    <div className="text-center py-2 max-w-lg mx-auto my-10">
      <h1>Influence minting a Noun.</h1>
      <h3 className="text-lg">
        Incentivize players of{" "}
        <a href="https://fomonouns.wtf/" target="_blank">
          FOMO Nouns
        </a>{" "}
        to mint your favorite trait
        <br />
        by sponsoring a non-profit.
      </h3>
      <Link href="/add">
        <a className="text-white font-bold py-2 px-4 rounded bg-blue-500 hover:opacity-70 no-underline inline-block my-4">
          Create a Request
        </a>
      </Link>
    </div>
  );
};

const OpenSponsorships = () => {
  // Get donations pertaining to next noun
  const { nextAuctionDonations, nextAuctionId } =
    useGetDonationsForUpcomingNoun();
  const [filteredTraitType, setFilteredTraitType] = useState<number | null>();
  const orderedTraitTitles = [3, 4, 2, 1]; // not showing backgrounds in tabs
  const traitTypes = [
    "backgrounds",
    "bodies",
    "accessories",
    "heads",
    "glasses",
  ];
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const handleModal = (request: TraitAndDonations) => {
    setModalContent(
      <RequestCard
        trait={request.trait}
        donations={request.donations}
        key={`${request.donations}${request.trait.name}}`}
        cardStyle="detailed"
      />
    );
    setShowModal(!showModal);
  };

  return (
    <>
      <div className="text-center mt-20">
        <h2 className="text-4xl font-bold">Open sponsorships</h2>
        {/* TODO: Add countdown clock */}
        <p className="">
          Noun {nextAuctionId} available to mint in <CountdownClock />
        </p>
      </div>

      {/* Filters */}
      <div className="justify-center mt-5 mb-10 select-none grid grid-cols-2 sm:flex gap-2">
        {nextAuctionDonations &&
          orderedTraitTitles.map((traitType, index) => {
            const traitCount = Object.values(
              nextAuctionDonations[traitTypes[traitType]]
            ).length;
            return (
              <button
                key={index}
                className={cx(
                  filteredTraitType &&
                    filteredTraitType === traitType &&
                    "border-blue-500 text-white",
                  filteredTraitType &&
                    filteredTraitType !== traitType &&
                    "opacity-50",
                  "bg-white border-2 border-blue-500 text-blue-500 py-1 px-2 sm:py-2 sm:px-4 rounded-md sm:rounded-full mx-1 cursor-pointer font-sans font-semibold text-sm mr-2 hover:bg-slate-200 disabled:opacity-75 disabled:cursor-auto"
                )}
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
            className="py-2 grid-cols-2 col-span-2 px-4 no-underline rounded-full text-slate-500 font-sans font-semibold text-sm border-red focus:outline-none active:shadow-none"
          >
            clear
          </button>
        )}
      </div>

      {/* Grid of sponsorships */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-4">
        {nextAuctionDonations &&
          Object.entries(nextAuctionDonations).map(([traitType, traits]) => {
            const traitTypeId = traitTypes.indexOf(traitType);
            if (Object.values(traits).length == 0) return;
            if (filteredTraitType && traitTypeId != filteredTraitType) return;
            const grid = Object.values(traits)
              .filter((f) => f.trait.traitTypeId === traitTypeId)
              .map((request, i) => {
                const requestCard = (
                  <RequestCard
                    trait={request.trait}
                    donations={request.donations}
                    cardStyle="compact"
                  />
                );
                return (
                  <button key={i} onClick={() => handleModal(request)}>
                    {requestCard}
                  </button>
                );
              });
            return grid;
          })}
      </div>
      {showModal && (
        <Modal setShowModal={setShowModal} modalContent={modalContent}></Modal>
      )}
    </>
  );
};
const Home: NextPage = ({ isMounted }) => {
  return (
    <div className="container px-4 mx-auto pb-10">
      {/* Intro description */}
      <Hero />

      {/* Steps */}
      {isMounted && <Explainer />}

      {isMounted && <OpenSponsorships />}
    </div>
  );
};

export default Home;
