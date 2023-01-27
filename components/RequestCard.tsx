import { BigNumber, utils, constants } from "ethers";
import {
  Pledge,
  NounSeed,
  TraitNameAndImageData,
  BigNumberType,
} from "../types";
import Image from "next/image";
import { ImageData, getPartData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import { traitTypeNamesById, traitNamesById, traitPreposition } from "../utils";
import RequestRecipient from "./RequestRecipient";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useMemo } from "react";
import cx from "classnames";

type RequestCardProps = {
  cardStyle: "detailed" | "compact" | "matching" | undefined;
  trait: TraitNameAndImageData | undefined;
  pledges: Pledge[] | undefined;
  id?: number;
  nounSeed?: NounSeed;
  reimbursementBPS?: BigNumberType;
  donationSent?: boolean;
};

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

const RequestCard = (props: RequestCardProps) => {
  const part = getPart(props.trait?.traitTypeId, props.trait?.traitId);

  const total = useMemo(() => {
    if (!props.pledges) return constants.Zero;
    return props.pledges.reduce(function (sum, pledge) {
      return sum.add(pledge?.amount ?? constants.Zero);
    }, constants.Zero);
  }, [props.pledges]);
  return (
    <div className="bg-white w-full rounded-lg border border-slate-200 relative overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      <div className="absolute top-3 right-3">
        {!total?.isZero() && props.cardStyle === "compact" ? (
          <p className="text-sm md:text-md leading-none p-1 md:p-2 font-bold bg-slate-200 text-blue-500 rounded-md">
            {utils.formatEther(total)} ETH
          </p>
        ) : (
          <></>
        )}
      </div>
      <div className="flex gap-5 items-center p-3 text-left">
        <div className={cx(props.cardStyle === "compact" && "w-1/2")}>
          {/* Trait image - use bg color from noun if available */}
          <div
            className="aspect-square rounded-lg w-[4rem] md:w-[120px] smd:basis-[120px] grow-0 shrink-0 relative"
            style={
              props.nounSeed
                ? {
                    backgroundColor: `#${
                      ImageData.bgcolors[props.nounSeed[0]]
                    }`,
                  }
                : {
                    backgroundColor: `#${ImageData.bgcolors[1]}`,
                  }
            }
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
        {props.cardStyle !== "detailed" && (
          <div className="w-3/4 relative top-[15px] mb-[25px]">
            <p className="text-slate-400 text-xs md:text-sm leading-none capitalize">
              {props.trait?.type ?? "Trait type"}
            </p>
            <h3 className="text-sm md:text-xl font-bold leading-none capitalize">
              {props.trait?.name ?? "Select a Noun trait"}
            </h3>
          </div>
        )}
        {props.cardStyle === "detailed" && (
          <div className="w-3/4 pl-4">
            <p className="text-xl">
              {!props.donationSent ? "If a" : "A"} Noun with{" "}
              {traitPreposition(props.trait)} <br />
              <span className="whitespace-nowrap">
                <span className="bg-slate-200 font-bold text-xl capitalize px-2">
                  {props.trait?.name ?? "______"}
                </span>
              </span>
              <span className=""> {props.trait?.type ?? " type"} </span>
              {!props.donationSent ? "is" : "was"} minted
            </p>
          </div>
        )}
      </div>
      {/* {props.cardStyle === "matching" && total && (
        <p className="bg-blue-500 text-sm text-white font-bold p-2 pl-4">
          {total} Ξ will be sent to
        </p>
      )} */}
      <footer
        className={cx(
          "bg-slate-100 border-t border-t-slate-200 p-3",
          props.cardStyle === "compact" && "flex flex-row justify-between gap-4"
        )}
      >
        <div className="flex flex-row gap-3 items-center">
          {props.cardStyle === "compact" && (
            <p className="whitespace-nowrap text-slate-400 text-xs">
              {!props.donationSent ? "Pledged" : "Sent"} to
            </p>
          )}
          <ul
            className={cx(
              "flex flex-col gap-4 w-full align-start",
              props.cardStyle === "compact" && "!flex-row"
            )}
          >
            {props.pledges
              ? props.pledges.map((pledge, i) => (
                  <RequestRecipient
                    cardStyle={props.cardStyle || "detailed"}
                    key={i}
                    pledge={pledge}
                    reimbursementBPS={props.reimbursementBPS}
                    lineBreak={props.pledges.length > 1}
                    donationSent={props.donationSent}
                  />
                ))
              : "Supporting the charity of your choice"}
          </ul>
        </div>
        {props.cardStyle === "compact" && !props.donationSent && (
          <p className="text-sm underline opacity-70 self-center">details</p>
        )}
      </footer>
      {/* ))} */}
    </div>
  );
};

export default RequestCard;
