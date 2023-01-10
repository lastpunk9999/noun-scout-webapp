import { useState } from "react";
import type { NextPage } from "next";
import useGetDonationsForUpcomingNoun from "../../hooks/useGetDonationsForUpcomingNoun";
import RequestCard from "../../components/RequestCard";
import Link from "next/link";
import Modal from "../../components/Modal";
import {
  Request,
  TraitAndDonations,
  PluralTraitName,
  SingularTraitName,
} from "../../types";
import cx from "classnames";
import { pluralTraitToSingular } from "../../utils";
import CountdownClock from "../../components/CountdownClock";

const OpenSponsorships = () => {
  // Get donations pertaining to next noun
  const { nextAuctionDonations, nextAuctionId } =
    useGetDonationsForUpcomingNoun();
  const requests = Object.values(nextAuctionDonations ?? {})
    .reduce((arr, i) => [...arr, ...Object.values(i)], [])
    .sort((a, b) => (a.total.lt(b.total) ? 1 : -1));
  const [filteredTraitType, setFilteredTraitType] =
    useState<SingularTraitName | null>();
  const traitTypes: PluralTraitName[] = [
    "heads",
    "glasses",
    "accessories",
    "bodies",
    "backgrounds",
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
        <h2 className="text-4xl font-bold">All sponsorships</h2>
        {/* TODO: Add countdown clock */}
        <p className="">
          All sponsorships for the next Noun (minting in <CountdownClock />)
        </p>
      </div>

      {/* Filters */}
      <div className="justify-center mt-5 mb-10 select-none grid grid-cols-2 sm:flex gap-2">
        {nextAuctionDonations &&
          traitTypes.map((traitType) => {
            const traitCount = Object.values(
              nextAuctionDonations[traitType]
            ).length;
            const disabled = traitCount === 0;
            const singularTraitType = pluralTraitToSingular(traitType);
            return (
              <button
                key={traitType}
                className={cx(
                  filteredTraitType &&
                    filteredTraitType === singularTraitType &&
                    "border-blue-500 text-white",
                  filteredTraitType &&
                    filteredTraitType !== singularTraitType &&
                    "opacity-75",
                  "bg-white border-2 border-blue-500 text-blue-500 py-1 px-2 sm:py-2 sm:px-4 rounded-md sm:rounded-full mx-1 cursor-pointer font-sans font-semibold text-sm mr-2 disabled:opacity-50 disabled:cursor-auto",
                  !disabled && "hover:bg-slate-200"
                )}
                onClick={() => {
                  setFilteredTraitType((prev) => {
                    if (prev === singularTraitType) return null;
                    return singularTraitType;
                  });
                }}
                disabled={disabled}
              >
                {traitCount} {traitType}
              </button>
            );
          })}
        {/* {filteredTraitType && (
          <button
            onClick={() => setFilteredTraitType(null)}
            className="py-2 grid-cols-2 col-span-2 px-4 no-underline rounded-full text-slate-500 font-sans font-semibold text-sm border-red focus:outline-none active:shadow-none"
          >
            clear
          </button>
        )} */}
      </div>

      {/* Grid of sponsorships */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-4">
        {requests.map(
          (request, i) =>
            (filteredTraitType && filteredTraitType != request.trait.type) || (
              <button key={i} onClick={() => handleModal(request)}>
                <RequestCard
                  trait={request.trait}
                  donations={request.donations}
                  cardStyle="compact"
                />
              </button>
            )
        )}
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
      {isMounted && <OpenSponsorships />}
    </div>
  );
};

export default Home;
