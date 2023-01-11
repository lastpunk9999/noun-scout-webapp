import { useState } from "react";
import type { NextPage } from "next";
import useGetDonationsForUpcomingNoun from "../hooks/useGetDonationsForUpcomingNoun";
import RequestCard from "../components/RequestCard";
import Link from "next/link";
import Modal from "../components/Modal";
import { Request, TraitAndDonations } from "../types";
import cx from "classnames";
import { utils } from "ethers";
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
        to mint your favorite trait.
      </h3>
      <Link href="/add">
        <button className="text-white font-bold py-2 px-4 rounded bg-blue-500 hover:opacity-70 no-underline inline-block my-4">
          Show me ⌐◨-◨
        </button>
      </Link>
    </div>
  );
};

const TopSponsorships = () => {
  // Get donations pertaining to next noun
  const { nextAuctionDonations, nextAuctionId } =
    useGetDonationsForUpcomingNoun();

  let topDonations = Object.values(nextAuctionDonations ?? {})
    .reduce((arr, i) => [...arr, ...Object.values(i)], [])
    .sort((a, b) => (a.total.lt(b.total) ? 1 : -1));

  const donationsLength = topDonations.length;

  const topLength = 8;

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
      <div className="text-center mt-20 mb-10">
        <h2 className="text-4xl font-bold">Top sponsorships</h2>
        {/* TODO: Add countdown clock */}
        {/* <p className="mb-10">
          Highest requests for the next Noun (minting in <CountdownClock />)
        </p> */}
      </div>
      {/* Grid of sponsorships */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-4">
        {nextAuctionDonations &&
          topDonations.slice(0, topLength).map((request, i) => {
            return (
              <button key={i} onClick={() => handleModal(request)}>
                <RequestCard
                  trait={request.trait}
                  donations={request.donations}
                  cardStyle="compact"
                />
              </button>
            );
          })}
      </div>
      {donationsLength > topLength && (
        <div className="text-center py-2">
          <Link href="/all">
            <button className="text-white font-bold py-2 px-4 rounded bg-blue-500 hover:opacity-70 no-underline inline-block my-4">
              More...
            </button>
          </Link>
        </div>
      )}
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

      {isMounted && <TopSponsorships />}
    </div>
  );
};

export default Home;
