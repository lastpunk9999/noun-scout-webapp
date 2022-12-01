import { utils } from "ethers";
import { Donation, NounSeed, TraitNameAndImageData } from "../types";
import Image from "next/image";
import { ImageData, getPartData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import { traitTypeNamesById, traitNamesById } from "../utils";
import RequestDonee from "./RequestDonee";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type RequestCardProps = {
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

  return (
    <div className="bg-white p-3 w-full rounded-lg border border-slate-200 pb-4">
      <div className="flex gap-3 items-center">
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
          <p className="text-slate-400 text-xs leading-none capitalize">
            {traitId >= 0 ? traitTypeNames[0] : "Trait type"}
          </p>
          <h3 className="text-xl font-bold leading-none capitalize">
            {traitId !== undefined ? (
              traitNamesById(traitTypeId, traitId)
            ) : (
              <>Select a Noun trait</>
            )}
          </h3>
          <hr className="my-1 border-slate-500/25" />
          <p className="text-slate-400 text-xs mb-1">Supporting</p>
          <ul className="flex gap-4">
            {props.donations
              ? props.donations.map((donation, i) => {
                  if (
                    !donation.amount?.isZero() ||
                    donation.amount === undefined
                  ) {
                    return <RequestDonee key={i} donation={donation} />;
                  } else {
                    // return <Skeleton width={100} />;
                    return "Charity of your choice";
                  }
                })
              : "Charity of your choice"}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
