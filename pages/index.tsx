import { useState } from "react";
import type { NextPage } from "next";
import useGetPledgesForUpcomingNoun from "../hooks/useGetPledgesForUpcomingNoun";
import RequestCard from "../components/RequestCard";
import Link from "next/link";
import Modal from "../components/Modal";
import { Request, TraitAndPledges } from "../types";
import cx from "classnames";
import { utils } from "ethers";
import Explainer from "../components/Explainer";
import CountdownClock from "../components/CountdownClock";

const Hero = () => {
  return (
    <div className="text-center py-2 mx-auto my-20">
      <h1 className="text-xlg">Want a Noun Trait minted?</h1>
      <h3 className="text-lg">
        Incentivize players of{" "}
        <a href="https://fomonouns.wtf/" target="_blank">
          FOMO Nouns
        </a>{" "}
        to mint your favorite trait.
      </h3>
      {/* <Link href="/add">
        <button className="text-white font-bold py-2 px-4 rounded bg-blue-500 hover:opacity-70 no-underline inline-block my-4">
          Show me ⌐◨-◨
        </button>
      </Link> */}
    </div>
  );
};

const TopRequests = () => {
  // Get pledges pertaining to next noun
  const { nextAuctionPledges, nextAuctionId } = useGetPledgesForUpcomingNoun();

  let topPledges = Object.values(nextAuctionPledges ?? {})
    .reduce((arr, i) => [...arr, ...Object.values(i)], [])
    .sort((a, b) => (a.total.lt(b.total) ? 1 : -1));

  const pledgesLength = topPledges.length;

  const topLength = 8;

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
      <div className="text-center mt-20 mb-10">
        <h2 className="text-4xl font-bold">Top requests</h2>
        {/* TODO: Add countdown clock */}
        {/* <p className="mb-10">
          Highest requests for the next Noun (minting in <CountdownClock />)
        </p> */}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-4">
      {/* Grid of requests */}
        {nextAuctionPledges &&
          topPledges.slice(0, topLength).map((request, i) => {
            return (
              <button key={i} onClick={() => handleModal(request)}>
                <RequestCard
                  trait={request.trait}
                  pledges={request.pledges}
                  cardStyle="compact"
                />
              </button>
            );
          })}
      </div>
      {pledgesLength > topLength && (
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

      {isMounted && <TopRequests />}
    </div>
  );
};

export default Home;
