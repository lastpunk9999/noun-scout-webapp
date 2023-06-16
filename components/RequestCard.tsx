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
import {
  traitTypeNamesById,
  traitNamesById,
  traitPreposition,
  isNonAuctionedNounId,
} from "../utils";
import RequestRecipient from "./RequestRecipient";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useMemo } from "react";
import cx from "classnames";

type RequestCardProps = {
  cardStyle: "detailed" | "compact" | "matching" | "settling" | undefined;
  trait: TraitNameAndImageData | undefined;
  pledges: Pledge[] | undefined;
  id?: number;
  nounSeed?: NounSeed;
  nounId?: number;
  reimbursementBPS?: BigNumberType | number;
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
    let total = props.pledges.reduce(function (sum, pledge) {
      return sum.add(pledge?.amount ?? constants.Zero);
    }, constants.Zero);
    return total;
  }, [props.pledges]);
  let reimbursement = constants.Zero;
  if (props.reimbursementBPS) {
    reimbursement = total.mul(props.reimbursementBPS).div("10000");
  }
  let recipients;
  if (props.pledges) {
    recipients = props.pledges.map((pledge, i) => (
      <RequestRecipient
        cardStyle={props.cardStyle || "detailed"}
        key={i}
        pledge={pledge}
        reimbursementBPS={props.reimbursementBPS}
        lineBreak={props.pledges.length > 1}
        donationSent={props.donationSent}
      />
    ));
    if (
      !reimbursement.isZero() &&
      (props.cardStyle === "detailed" || props.cardStyle === "matching") &&
      !props.donationSent
    ) {
      recipients.push(
        <RequestRecipient
          cardStyle={"detailed"}
          pledge={{
            amount: reimbursement,
          }}
          isSettler={true}
          lineBreak={props.pledges.length > 1}
          donationSent={props.donationSent}
        />
      );
    }
  } else {
    recipients = <RequestRecipient cardStyle={props.cardStyle || "detailed"} />;
  }
  const NounIdentifier = (
    <>
      {!props.donationSent
        ? `If ${
            props.nounId && props.nounId !== 0 && props.nounId !== 1
              ? `Noun ${props.nounId}`
              : `a ${props.nounId === 1 ? "non-auctioned" : ""} Noun`
          }`
        : `A ${props.nounId === 1 ? "non-auctioned" : ""} Noun`}{" "}
    </>
  );
  const Tense = <>{!props.donationSent ? "is" : "was"} minted</>;
  const TraitNameAndType = (
    <>
      <span className="whitespace-nowrap">
        <span
          className={cx(
            props.trait?.name &&
              "text-xl capitalize bg-slate-200 font-bold px-2",
            ""
          )}
        >
          {props.trait?.name ?? "your trait"}
        </span>
      </span>
      <span className=""> {props.trait?.type} </span>
    </>
  );

  return (
    <div className="bg-white w-full rounded-lg border border-slate-200 relative shadow-sm hover:shadow-lg transition-shadow">
      {props.cardStyle === "compact" && isNonAuctionedNounId(props.nounId) && (
        <span className="py-1 px-2 bg-green-600 text-white font-bold text-sm block rounded-md absolute -top-2 -left-2 z-10">
          Only Noun {props.nounId}
        </span>
      )}
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
              {props.nounId ? (
                <>
                  {NounIdentifier}
                  {Tense} with {props.trait && traitPreposition(props.trait)}
                  {TraitNameAndType}
                </>
              ) : (
                <>
                  {NounIdentifier} with{" "}
                  {props.trait && traitPreposition(props.trait)} <br />
                  {TraitNameAndType}
                  {Tense}
                </>
              )}
            </p>
          </div>
        )}
      </div>

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
            {recipients}
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
