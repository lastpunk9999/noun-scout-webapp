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

type RequestCardProps = {
  cardStyle: "detailed" | "compact" | undefined;
  trait: TraitNameAndImageData | undefined;
  donations: Donation[] | undefined;
  id?: number;
  nounSeed?: NounSeed;
};

const getPart = (partType: string, partIndex: number) => {
  const data = getPartData(partType, partIndex);
  const image = `data:image/svg+xml;base64,${btoa(
    buildSVG([{ data }], ImageData.palette)
  )}`;
  return { image };
};

const RequestCard = (props: RequestCardProps) => {
  const traitTypeId =
    props.trait?.traitTypeId >= 0 ? props.trait.traitTypeId : undefined;
  const traitId = props.trait?.traitId >= 0 ? props.trait.traitId : undefined;
  const traitTypeNames = traitTypeNamesById(traitTypeId) || undefined;
  const part =
    traitTypeId > 0 && traitTypeNames && getPart(traitTypeNames[1], traitId);

  const totalDonationAmount = useMemo(() => {
    if (!props.donations) return 0;
    return props.donations.reduce(function (acc, obj) {
      const amount = obj.amount ? Number(utils.formatEther(obj.amount)) : 0;
      return acc + amount;
    }, 0);
  }, [props.donations]);
  return (
    <div className="bg-white w-full rounded-lg border border-slate-200 relative">
      <div className="absolute top-3 right-3">
        {totalDonationAmount && (
          <p className="text-mdleading-none px-3 py-2 font-bold bg-green-700 text-white rounded-md">
            Ξ {totalDonationAmount}
          </p>
        )}
      </div>
      <div className="flex gap-5 items-center p-3">
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
            {part ? (
              <Image src={part.image} layout="fill" />
            ) : (
              <>
                {/* exception for background color traits */}
                {traitId >= 0 ? (
                  <div
                    className="opacity-30 relative z-10 h-100 aspect-square"
                    style={{
                      backgroundColor: `#${ImageData.bgcolors[traitId]}`,
                    }}
                  />
                ) : (
                  <div className="opacity-30 relative z-10 h-100 aspect-square">
                    <Image src="/loading-noun.gif" layout="fill" />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="w-3/4">
          <p className="text-slate-400 text-sm leading-none capitalize">
            {traitId >= 0 ? traitTypeNames[0] : "Trait type"}
          </p>
          <h3 className="text-3xl font-bold leading-none capitalize">
            {traitId !== undefined ? (
              traitNamesById(traitTypeId, traitId)
            ) : (
              <>Select a Noun trait</>
            )}
          </h3>
        </div>
      </div>
      <footer className="bg-slate-200 p-3">
        <p className="text-slate-400 text-xs mb-1">Supporting</p>
        <ul className="flex gap-4">
          {props.donations
            ? props.donations.map((donation, i) => {
                if (
                  donation.amount?.isZero() ||
                  donation.amount === undefined ||
                  donation.to === undefined
                ) {
                  return "The charity of your choice";
                } else {
                  return (
                    <RequestDonee
                      cardStyle={props.cardStyle}
                      key={i}
                      donation={donation}
                    />
                  );
                }
              })
            : "The charity of your choice"}
        </ul>
      </footer>
      {/* ))} */}
    </div>
  );
};

export default RequestCard;
