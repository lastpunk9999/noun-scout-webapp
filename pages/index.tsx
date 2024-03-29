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
import { useAppContext } from "../context/state";
import Today from "./today";
import Settle from "./settle";

const Hero = () => {
  return (
    <div className="text-center mx-auto mb-16">
      <h1 className="text-xlg">Want a Noun Trait minted?</h1>
      <h3 className="text-lg">
        Influence minting your favorite trait <br />
        (and do some good at the same time)
      </h3>
      {/* <Link href="/add">
        <button className="text-white font-bold py-2 px-4 rounded bg-blue-500 hover:opacity-70 no-underline inline-block my-4">
          Show me how
        </button>
      </Link> */}
    </div>
  );
};

const TopRequests = () => {
  // Get pledges pertaining to next noun
  const {
    nextAuctionPledges,
    nextAuctionId,
    nextNonAuctionId,
    nextNonAuctionPledges,
  } = useGetPledgesForUpcomingNoun();
  const { auction } = useAppContext() ?? {};

  // @ts-ignore
  let topPledges = [
    ...Object.values(nextAuctionPledges ?? {}),
    ...Object.values(nextNonAuctionPledges ?? {}),
  ]
    // @ts-ignore
    .reduce((arr, i) => [...arr, ...Object.values(i)], [])
    // @ts-ignore
    .sort((a, b) => (a.total.lt(b.total) ? 1 : -1));

  const pledgesLength = topPledges.length;

  const topLength = 3;

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const handleModal = (request: TraitAndPledges) => {
    setModalContent(
      <RequestCard
        trait={request.trait}
        pledges={request.pledges}
        nounId={request.nounId}
        reimbursementBPS={request.reimbursementBPS}
        key={`${request.pledges}${request.trait.name}}`}
        cardStyle="detailed"
      />
    );
    setShowModal(!showModal);
  };
  if (topPledges.length === 0) return;
  return (
    <>
      <div className="text-center mt-20 mb-10">
        <h2 className="text-4xl font-bold">Highest Pledges</h2>
        {/* TODO: Add countdown clock */}
        <p className="mb-10">
          Most popular traits for the next Noun
          {nextAuctionId > nextNonAuctionId && "s"}{" "}
          {auction?.endTime && (
            <>
              (
              <a
                href="https://nouns.wtf/"
                target="_blank"
                className="font-normal"
              >
                minting <CountdownClock endTime={auction.endTime.toNumber()} />
              </a>
              )
            </>
          )}
        </p>
      </div>
      <div className="mx-auto xl:mx-4 mt-10 md:mb-10 flex flex-col md:grid md:grids-cols-2 xl:grid-cols-3 xl:gap-2 md:max-w-[60%] xl:max-w-[100%]">
        {/* Grid of requests */}
        {nextAuctionPledges &&
          topPledges.slice(0, topLength).map((request, i) => {
            return (
              <div className="grid grid-cols-8 md:grid-cols-6 md:mb-4" key={i}>
                <div className="col-span-1 my-auto">
                  <p className="text-2xl md:text-3xl font-bold md:text-right md:mr-4 pb-[6rem] md:pb-[4rem]">
                    #{i + 1}
                  </p>
                </div>
                <button
                  onClick={() => handleModal(request)}
                  className="col-span-7 md:col-span-5 block mb-8 md:mb-0"
                >
                  <RequestCard
                    trait={request.trait}
                    pledges={request.pledges}
                    nounId={request.nounId}
                    reimbursementBPS={request.reimbursementBPS}
                    cardStyle="compact"
                  />
                </button>
              </div>
            );
          })}
      </div>

      <div className="text-center">
        <Link href="/all">
          <button className="text-white font-bold py-2 px-4 rounded bg-blue-500 hover:opacity-70 no-underline inline-block my-4">
            {pledgesLength > topLength ? `More...` : "All requests"}
          </button>
        </Link>
      </div>

      {showModal && (
        <Modal setShowModal={setShowModal} modalContent={modalContent}></Modal>
      )}
      <hr className="mt-10 w-full h-1 bg-slate-200 border-0 rounded" />
    </>
  );
};

const Home = (props) => {
  return (
    <div className="container px-4 mx-auto pb-10">
      {/* Intro description */}
      <Hero />

      {/* Steps */}
      {props.isMounted && (
        <>
          <Explainer />
          <div className="text-center mx-auto mb-5">
            <Link href="/add">
              <button className="text-white font-bold py-2 px-4 rounded bg-blue-500 hover:opacity-70 no-underline inline-block my-4">
                Pick your trait
              </button>
            </Link>
          </div>
          <hr className="w-full h-1 bg-slate-200 border-0 rounded" />
          <TopRequests />

          <div className="mt-20 mb-10">
            <Today asComponent={true} />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
