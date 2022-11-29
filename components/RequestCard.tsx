import { utils } from "ethers";
import { Donation, NounSeed, TraitNameAndImageData } from "../types";
import Image from "next/image";
import { ImageData, getPartData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import { traitTypeNamesById, traitNamesById } from "../utils";
import RequestDonee from "./RequestDonee";

type RequestCardProps = {
  trait: TraitNameAndImageData;
  donations: Donation[];
  id?: number;
  nounSeed?: NounSeed;
}

const getPart = (partType: string, partIndex: number) => {
  const data = getPartData(partType, partIndex);
  const image = `data:image/svg+xml;base64,${btoa(buildSVG([{ data }], ImageData.palette))}`;
  return { image };
}; 

const RequestCard = (props: RequestCardProps) => {
  const traitTypeId = props.trait.traitTypeId;
  const traitId = props.trait.traitId;
  const traitTypeNames = traitTypeNamesById(traitTypeId);
  const part = traitTypeId !== 0 && getPart(traitTypeNames[1], traitId);
  return (
    <div className="bg-white p-3 w-full rounded-lg border border-slate-200 pb-4">
        <div>
          {props.id > 0 && (
            <>
              <p>Noun {props.id} specific</p>
            </>
          )}
        </div>
        <div className="flex gap-3 items-center">        
          <div className="w-2/4">
            {/* Trait image - use bg color from noun if available */}
            <div 
              className="aspect-square rounded-lg w-lg relative"
              style={
                props.nounSeed ? {
                  backgroundColor: `#${ImageData.bgcolors[props.nounSeed[0]]}`
                } : {
                  backgroundColor: `#${ImageData.bgcolors[0]}`
                }
              }
              >
              {traitTypeId !== 0 && (
                <Image src={part.image ? part.image : ''} layout="fill" />
              )}            
            </div>
          </div>
          <div className="w-3/4">
            <p className="text-slate-400 text-xs leading-none capitalize">{traitTypeNames[0]}</p>
            <h3 className="text-xl font-bold leading-none capitalize">
              {traitNamesById(traitTypeId, traitId)}
            </h3>
            <hr className="my-1 border-slate-500/25" /> 
            <p className="text-slate-400 text-xs mb-1">Supporting</p>
            <ul className="flex gap-4">
              {props.donations.map((donation, i) => {
                console.log('props.donations.map', donation);
                if (donation && !donation.amount.isZero()) {
                  return (
                    <RequestDonee 
                      key={i}
                      donation={donation}
                    />
                  );
                }
              })}
            </ul>
          </div>  
        </div>    
    </div>
  );
}

export default RequestCard;