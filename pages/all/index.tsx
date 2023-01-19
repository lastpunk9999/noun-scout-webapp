import { useState } from "react";
import type { NextPage } from "next";
import useGetPledgesForUpcomingNoun from "../../hooks/useGetPledgesForUpcomingNoun";
import RequestCard from "../../components/RequestCard";
import Link from "next/link";
import Modal from "../../components/Modal";
import {
  Request,
  TraitAndPledges,
  PluralTraitName,
  SingularTraitName,
} from "../../types";
import cx from "classnames";
import { pluralTraitToSingular } from "../../utils";
import CountdownClock from "../../components/CountdownClock";

const OpenRequests = () => {
  // Get pledges pertaining to next noun
  const { nextAuctionPledges, nextAuctionId } = useGetPledgesForUpcomingNoun();
  const requests = Object.values(nextAuctionPledges ?? {})
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

  const handleModal = (request: TraitAndPledges) => {
    setModalContent(
      <RequestCard
        trait={request.trait}
        pledges={request.pledges}
        key={`${request.pledges}${request.trait.name}}`}
        cardStyle="detailed"
      />
    );
    setShowModal(!showModal);
  };

  return (
    <>
      <div className="text-center mt-20">
        <h2 className="text-4xl font-bold">All requests</h2>
        {/* TODO: Add countdown clock */}
        <p className="">
          All requests for the next Noun (minting in <CountdownClock />)
        </p>
      </div>

      {/* Filters */}
      <div className="justify-center mt-5 mb-10 select-none grid grid-cols-2 sm:flex gap-2">
        {nextAuctionPledges &&
          traitTypes.map((traitType) => {
            const traitCount = Object.values(
              nextAuctionPledges[traitType]
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

      {/* Grid of requests */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-4">
        {requests.map(
          (request, i) =>
            (filteredTraitType && filteredTraitType != request.trait.type) || (
              <button key={i} onClick={() => handleModal(request)}>
                <RequestCard
                  trait={request.trait}
                  pledges={request.pledges}
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
      {isMounted && <OpenRequests />}
    </div>
  );
};

export default Home;
