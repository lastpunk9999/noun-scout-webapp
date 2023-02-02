import { useState, useMemo } from "react";
import type { NextPage } from "next";
import useGetPledgesForUpcomingNoun from "../../hooks/useGetPledgesForUpcomingNoun";
import RequestCard from "../../components/RequestCard";
import RequestRecipient from "../../components/RequestRecipient";
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

import { BigNumber, utils, constants } from "ethers";
import Image from "next/image";
import { ImageData, getPartData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import {
  traitTypeNamesById,
  traitNamesById,
  traitPreposition,
} from "../../utils";

const getPart = (
  traitTypeId: number | undefined,
  traitId: number | undefined
) => {
  if (traitTypeId === undefined || traitId === undefined)
    return {
      image: "/loading-noun.gif",
    };
  let background;
  let data = "";
  if (traitTypeId === 0) {
    background = ImageData.bgcolors[traitId];
  } else {
    data = getPartData(traitTypeNamesById(traitTypeId)[1], traitId);
  }
  const image = `data:image/svg+xml;base64,${btoa(
    buildSVG([{ data }], ImageData.palette, background)
  )}`;
  return { image };
};

const OpenRequests = () => {
  // Get pledges pertaining to next noun
  const { nextAuctionPledges, nextAuctionId } = useGetPledgesForUpcomingNoun();
  //@ts-ignore
  const requests = Object.values(nextAuctionPledges ?? {})
    //@ts-ignore
    .reduce((arr, i) => [...arr, ...Object.values(i)], [])
    //@ts-ignore
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
      <div className="text-center mt-5 sm:mt-20">
        <h2 className="text-4xl font-bold">Open requests</h2>
        {/* TODO: Add countdown clock */}
        <p className="">
          Requests for the next Noun sorted by highest pledged.
        </p>
      </div>
      {/* Filters */}
      <div className="justify-center mt-10 mb-5 select-none grid grid-cols-2 md:flex gap-2">
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
                  "block relative",
                  filteredTraitType &&
                    filteredTraitType === singularTraitType &&
                    "border-blue-500 text-white",
                  filteredTraitType &&
                    filteredTraitType !== singularTraitType &&
                    "opacity-75",
                  "bg-white border-2 border-blue-500 text-blue-500 py-1 px-2 lg:py-2 lg:px-4 rounded-md lg:rounded-full mx-1 cursor-pointer font-sans font-semibold text-sm mr-2 disabled:opacity-50 disabled:cursor-auto",
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
                {filteredTraitType &&
                  filteredTraitType === singularTraitType && (
                    <div className="inline ml-2 -mr-2 px-2 bg-white font-bold text-sm block rounded-lg border">
                      <span className="sm:hidden">clear</span>
                      <span className="hidden sm:inline">X</span>
                    </div>
                  )}
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

      {/* Request Cards */}
      <div className="flex flex-col gap-5 px-2 lg:hidden mx-auto md:w-[30rem]">
        {requests.map(
          (request, i) =>
            (filteredTraitType && filteredTraitType != request.trait.type) || (
              <div className="grid grid-cols-10" key={i}>
                <div className="col-span-1 my-auto">
                  <p className="text-xl font-bold pb-[4rem]">#{i + 1}</p>
                </div>
                <button
                  key={i}
                  onClick={() => handleModal(request)}
                  className="col-span-9 block mb-8s"
                >
                  <RequestCard
                    trait={request.trait}
                    pledges={request.pledges}
                    cardStyle="compact"
                  />
                </button>
              </div>
            )
        )}
      </div>
      {/* Request Table */}
      <div className="hidden lg:block relative overflow-x-auto">
        <RequestsTable
          requests={requests}
          filteredTraitType={filteredTraitType}
          onRowClick={handleModal}
        />
      </div>

      {showModal && (
        <Modal setShowModal={setShowModal} modalContent={modalContent}></Modal>
      )}
    </>
  );
};

const RequestsTable = (props) => {
  return (
    <table className="w-full xl:max-w-[80%] mx-auto text-left">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">
            Popularity
          </th>
        </tr>
      </thead>
      <tbody>
        {props.requests.map(
          (request, i) =>
            (props.filteredTraitType &&
              props.filteredTraitType != request.trait.type) || (
              <tr
                className="bg-white border-b hover:bg-slate-100 hover:cursor-pointer"
                key={i}
                onClick={() => props.onRowClick(request)}
              >
                <RequestRow
                  trait={request.trait}
                  pledges={request.pledges}
                  index={i + 1}
                  key={i}
                />
              </tr>
            )
        )}
      </tbody>
    </table>
  );
};
const RequestRow = (props) => {
  const part = getPart(props.trait?.traitTypeId, props.trait?.traitId);

  const total = useMemo(() => {
    if (!props.pledges) return constants.Zero;
    return props.pledges.reduce(function (sum, pledge) {
      return sum.add(pledge?.amount ?? constants.Zero);
    }, constants.Zero);
  }, [props.pledges]);
  return (
    <>
      <td scope="row" className="text-center w-24">
        <p className="text-xl font-bold">{props.index}</p>
      </td>
      <td scope="row" className="px-6 py-4">
        <div className="flex my-auto items-center">
          <div className="w-24">
            <div
              className="aspect-square rounded-lg w-full grow-0 shrink-0 relative"
              style={{
                backgroundColor: `#${ImageData.bgcolors[1]}`,
              }}
            >
              <Image
                src={part.image}
                layout="fill"
                className={cx(
                  "w-full aspect-square",
                  // scale up accessory and bodies
                  (props.trait?.traitTypeId === 1 ||
                    props.trait?.traitTypeId === 2) &&
                    "scale-[170%] !-top-[70%]",
                  props.trait?.traitTypeId === 4 &&
                    "scale-[150%] !top-[10%] !left-[3%]",
                  props.trait?.traitTypeId === 3 && "!top-[20%]"
                )}
              />
            </div>
          </div>
          <div className="grow relative pl-4 pt-5">
            <p className="text-slate-400 text-xs md:text-sm leading-none capitalize">
              {props.trait?.type}
            </p>
            <h3 className="text-sm md:text-xl font-bold leading-none capitalize">
              {props.trait?.name}
            </h3>
          </div>
        </div>
      </td>

      <td>
        <ul className="">
          {props?.pledges?.map((pledge, i) => (
            <>
              <RequestRecipient
                cardStyle={"row"}
                key={i}
                pledge={pledge}
                reimbursementBPS={props.reimbursementBPS}
                lineBreak={props.pledges.length > 1}
              />
            </>
          ))}
        </ul>
      </td>
      <td className="px-6 py-4">
        <p
          className={cx(
            props.index < 20 && "md:text-lg",
            props.index < 10 && "md:text-xl",
            props.index < 5 && "font-bold"
          )}
        >
          {utils.formatEther(total)} ETH
        </p>
      </td>
      <td className="px-6 py-4">
        <a href="#" onClick={(e) => e.preventDefault()}>
          details
        </a>
      </td>
    </>
  );
};

const Home = (props) => {
  return (
    <div className="container px-4 mx-auto pb-10">
      {props.isMounted && <OpenRequests />}
    </div>
  );
};

export default Home;
