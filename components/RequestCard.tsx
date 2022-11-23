import { useState } from "react";
import Link from "next/link";
import { BigNumber, utils } from "ethers";
import { Donation, NounSeed } from "../types";
import Image from "next/image";
import { ImageData, getPartData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import { traitTypeNamesById, traitNamesById, parseTraitName } from "../utils";
import useGetDoneeDescription from "../hooks/useGetDoneeDescription";
import RequestDonee from "./RequestDonee";

type RequestCardProps = {
  traitTypeId: number;
  traitId: number;
  donations: Donation[];
  id?: number;
  nounSeed?: NounSeed;
}

const getPart = (partType: string, partIndex: number) => {
  console.log('partType, partIndex', partType, partIndex);
  const data = getPartData(partType, partIndex);
  const image = `data:image/svg+xml;base64,${btoa(buildSVG([{ data }], ImageData.palette))}`;
  return { image };
}; 

const RequestCard = (props: RequestCardProps) => {
  const traitTypeNames = traitTypeNamesById(props.traitTypeId);
  const part = props.traitTypeId !== 0 && getPart(traitTypeNames[1], props.traitId);
  const bgColorNames = ["Cool", "Warm"];
  return (
    <div className="bg-white w-full rounded-lg overflow-hidden shadow-lg p-3">
        <div>
          {props.id !== 0 && (
            <>
              <p>Noun {props.id} specific</p>
            </>
          )}
        </div>
        <div className="flex gap-3">        
          <div className="w-1/4">
            {/* Trait image - use bg color from noun if available */}
            <div 
              className="w-full aspect-square rounded-lg"
              style={
                props.nounSeed ? {
                  backgroundColor: ImageData.bgcolors[props.nounSeed[0]]
                } : {
                  backgroundColor: ImageData.bgcolors[0]
                }
              }
              >
              {props.traitTypeId !== 0 && (
                <Image src={part.image ? part.image : ''} width={400} height={400} />
              )}            
            </div>
          </div>
          <div className="w-3/4">
            <p className="text-slate-500 text-sm leading-none capitalize">{traitTypeNames[0]}</p>
            {/* {props.traitTypeId !== 0 && ( */}
              <h3 className="text-xl font-bold leading-none capitalize">
                {traitNamesById(props.traitTypeId, props.traitId)}
              </h3>
            {/* )} */}
            <hr className="my-2 border-slate-500/25" /> 
            <p className="text-slate-500 text-sm mb-1">Supporting</p>
            <ul className="flex gap-4">
              {props.donations.map((donation, i) => {
                console.log('donation', donation);
                return (
                  <RequestDonee 
                    key={i}
                    donation={donation}
                  />
                );
              })}
            </ul>
          </div>  
        </div>    
    </div>
  );
}

export default RequestCard;
function getBackground(partIndex: any): any {
  throw new Error("Function not implemented.");
}

