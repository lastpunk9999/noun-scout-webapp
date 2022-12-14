import { BigNumber, utils } from "ethers";
import { Donation, NounSeed, TraitNameAndImageData } from "../types";
import Image from "next/image";
import { ImageData, getPartData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import { traitTypeNamesById, traitNamesById } from "../utils";
import RequestDonee from "./RequestDonee";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useMemo } from "react";
import cx from "classnames";

type RequestCardProps = {
  cardStyle: "detailed" | "compact" | "matching" | undefined;
  trait: TraitNameAndImageData | undefined;
  donations: Donation[] | undefined;
  id?: number;
  nounSeed?: NounSeed;
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

  const totalDonationAmount = useMemo(() => {
    if (!props.donations) return 0;
    return props.donations.reduce(function (acc, obj) {
      const amount = obj?.amount ? Number(utils.formatEther(obj.amount)) : 0;
      return acc + amount;
    }, 0);
  }, [props.donations]);
  return (
    <div className="bg-white w-full rounded-lg border border-slate-200 relative overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      <div className="absolute top-3 right-3">
        {totalDonationAmount && props.cardStyle !== "matching" ? (
          <p className="text-sm leading-none px-2 py-2 font-bold bg-slate-200 text-blue-500 rounded-md">
            Ξ {totalDonationAmount}
          </p>
        ) : (
          <></>
        )}
      </div>
      <div className="flex gap-5 items-center p-3 text-left">
        <div className="w-2/4">
          {/* Trait image - use bg color from noun if available */}
          <div
            className="aspect-square rounded-lg w-lg relative"
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
            <Image src={part.image} layout="fill" />
          </div>
        </div>
        <div className="w-3/4">
          <p className="text-slate-400 text-sm leading-none capitalize">
            {props.trait?.type ?? "Trait type"}
          </p>
          <h3 className="text-2xl font-bold leading-none capitalize">
            {props.trait?.name ?? "Select a Noun trait"}
          </h3>
        </div>
      </div>
      {props.cardStyle === "matching" && totalDonationAmount && (
        <p className="bg-blue-500 text-sm text-white font-bold p-2 pl-4">
          {totalDonationAmount} Ξ will be sent to
        </p>
      )}
      <footer
        className={cx(
          "bg-slate-100 border-t border-t-slate-200 p-3",
          props.cardStyle === "compact" && "flex flex-row justify-between gap-4"
        )}
      >
        <div className="flex flex-row gap-2 items-center">
          {props.cardStyle === "compact" && (
            <p className="text-slate-400 text-xs">Supporting</p>
          )}
          <ul
            className={cx(
              "flex flex-col gap-4 w-full align-start",
              props.cardStyle === "compact" && "!flex-row"
            )}
          >
            {props.donations
              ? props.donations.map((donation, i) => {
                  if (
                    donation.amount?.isZero() ||
                    donation.amount === undefined ||
                    donation.to === undefined
                  ) {
                    return "Supporting the charity of your choice";
                  } else {
                    return (
                      <RequestDonee
                        cardStyle={props.cardStyle || "detailed"}
                        key={i}
                        donation={donation}
                      />
                    );
                  }
                })
              : "Supporting the charity of your choice"}
          </ul>
        </div>
        {props.cardStyle === "compact" && (
          <button className="text-sm underline opacity-70">details</button>
        )}
      </footer>
      {/* ))} */}
    </div>
  );
};

export default RequestCard;
