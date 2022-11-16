import { useEffect, useState } from "react";
import { ImageData } from '@nouns/assets';
// import { ImageData as imageData, getPartData } from '@nouns/assets';
// import { buildSVG } from '@nouns/sdk';
import cx from 'classnames';
import parseTraitName from "../../utils/index";
import { RequestSeed } from "../../types";

type TraitTabProps = {
  traitIndex: number;
  setRequestSeed: Function;
  requestSeed: RequestSeed | undefined;
  filter: string;
}

const TraitTab = (props: TraitTabProps) => {
  const traitNames = [
    ...Object.values(ImageData.images).map(i => {
      return i.map(imageData => imageData.filename);
    }),
  ];

  // On hold until assets package is updated
  // const getPart = (partType: string, partIndex: number) => {
  //   const data = getPartData(partType, partIndex);
  //   const image = `data:image/svg+xml;base64,${btoa(buildSVG([{ data }], imageData.palette))}`;
  //   return { image };
  // }; 

  return (
    <>   
      <div className="grid grid-cols-3 lg:grid-cols-7 xl:grid-cols-10 gap-5">
        {traitNames[props.traitIndex].filter(f => f.includes(props.filter.toLowerCase()) || props.filter === '')
          .map(f => 
            <button 
              key={f}
              className={cx(
                "text-left", 
                props.requestSeed?.traitName === f && "bg-white shadow-lg border-2 border-slate-500 opacity-100",
                props.requestSeed?.traitName ? "opacity-50 hover:opacity-80" : "",
              )}
              onClick={() => props.requestSeed?.traitName === f ? props.setRequestSeed() : props.setRequestSeed({traitName: f})}
            >
              {/* Placeholder for trait image */}
              <img src="https://placeimg.com/320/320/nature" alt="" className="w-full aspect-square rounded" />
              <p className={cx("text-sm capitalize", props.requestSeed?.traitName === f && "font-bold")}>{parseTraitName(f)}</p>
            </button>
          )}
      </div>
    </>
  );
}

export default TraitTab;
