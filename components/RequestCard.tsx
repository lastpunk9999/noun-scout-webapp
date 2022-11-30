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
  const traitTypeId = props.trait?.traitTypeId || 0;
  const traitId = props.trait?.traitId || undefined;
  const traitTypeNames = traitTypeNamesById(traitTypeId) || undefined;
  const part = traitId && traitTypeNames && getPart(traitTypeNames[1], traitId);
  console.log(props.donations, "props.donations");
  return (
    <div className="bg-white p-3 w-full rounded-lg border border-slate-200 pb-4">
      {/* <div>
          {props.id > 0 && (
            <>
              <p>Noun {props.id} specific</p>
            </>
          )}
        </div> */}
      <div className="flex gap-3 items-center">
        <div className="w-2/4">
          {/* Trait image - use bg color from noun if available */}
          <div
            className="aspect-square rounded-lg w-lg relative"
            style={
              // part &&
              props.nounSeed
                ? {
                    backgroundColor: `#${
                      ImageData.bgcolors[props.nounSeed[0]]
                    }`,
                  }
                : {
                    backgroundColor: `#${ImageData.bgcolors[0]}`,
                  }
            }
          >
            {part ? (
              <Image
                src={part.image ? part.image : "/loading-noun.gif"}
                layout="fill"
              />
            ) : (
              <>
                <div className="opacity-30 relative z-10 h-100">
                  <Image src="/loading-noun.gif" layout="fill" />
                </div>
                {/* <Skeleton
                  containerClassName="w-full h-full aspect-square absolute top-0 left-0 z-0"
                  className="w-full h-full"
                /> */}
              </>
            )}
          </div>
        </div>
        <div className="w-3/4">
          <p className="text-slate-400 text-xs leading-none capitalize">
            {traitId ? traitTypeNames[0] : "Trait type"}
          </p>
          <h3 className="text-xl font-bold leading-none capitalize">
            {traitId !== undefined ? (
              traitNamesById(traitTypeId, traitId)
            ) : (
              <Skeleton width={100} height={20} />
            )}
          </h3>
          <hr className="my-1 border-slate-500/25" />
          <p className="text-slate-400 text-xs mb-1">Supporting</p>
          <ul className="flex gap-4">
            {props.donations ? (
              props.donations.map((donation, i) => {
                if (donation.amount && !donation.amount.isZero()) {
                  return <RequestDonee key={i} donation={donation} />;
                } else {
                  return <Skeleton width={100} />;
                }
              })
            ) : (
              <Skeleton width={100} />
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
