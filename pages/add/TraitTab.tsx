import { useEffect, useState } from "react";
import { ImageData, getPartData } from '@nouns/assets';
import cx from 'classnames';
import { parseTraitName } from "../../utils";
import { RequestSeed } from "../../types";
import { buildSVG } from "@nouns/sdk";

type TraitTabProps = {
  traitIndex: number;
  setRequestSeed: Function;
  requestSeed: RequestSeed | undefined;
  filter: string;
}

const TraitTab = (props: TraitTabProps) => {
  const traitTypes = ["Bodies", "Accessories", "Heads", "Glasses"];
  const traitNames = [
    ...Object.values(ImageData.images).map(i => {
      return i.map(imageData => imageData.filename);
    }),
  ];

  const getPart = (partType: string, partIndex: number) => {
    const data = getPartData(partType, partIndex);
    const image = `data:image/svg+xml;base64,${btoa(buildSVG([{ data }], ImageData.palette))}`;
    return { image };
  }; 

  const selectedTraits = ImageData.images[traitTypes[props.traitIndex].toLowerCase()].map((trait, index) => {
    return {
      id: index,
      filename: trait.filename,
      image: getPart(traitTypes[props.traitIndex].toLowerCase(), index).image,
    };
  });

  
  return (
    <>   
      <div className="grid grid-cols-3 lg:grid-cols-7 xl:grid-cols-10 gap-5">
        {selectedTraits.filter(f => f.filename.includes(props.filter.toLowerCase()) || props.filter === '')
          .map(f => {
            return (
              <button 
                key={f.filename}
                className={cx(
                  "text-left", 
                  props.requestSeed?.trait.name === f.filename && "bg-white shadow-lg border-2 border-slate-500 opacity-100",
                  props.requestSeed?.trait.name && props.requestSeed?.trait.name !== f.filename ? "opacity-50 hover:opacity-80" : "",
                )}
                onClick={() => 
                  props.requestSeed?.trait.name === f.filename 
                  ? props.setRequestSeed() 
                  : props.setRequestSeed({
                    traitTypeId: props.traitIndex,
                    traitId: f.id,
                    trait: {
                      name: f.filename, 
                      type: traitTypes[props.traitIndex],
                      imageData: {
                        filename: f.filename,
                        data: f.data,
                      }
                    },
                    donation: { 
                      to: undefined, 
                      amount: undefined 
                    }
                  })}
                >
                  <img src={f.image} alt="" className="w-full aspect-square rounded" />
                  <p className={cx("text-sm capitalize", props.requestSeed?.trait.name === f.filename && "font-bold")}>{parseTraitName(f.filename)}</p>
                </button>
              ) 
            }
          )}
      </div>
    </>
  );
}

export default TraitTab;
