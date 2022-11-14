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
}

const TraitTab = (props: TraitTabProps) => {
  const [filter, setFilter] = useState<string>('');
  const traitTitles = ["Bodies", "Accessories", "Heads", "Glasses"];
  const traitNames = [
    ...Object.values(ImageData.images).map(i => {
      return i.map(imageData => imageData.filename);
    }),
  ];

  useEffect(() => {
    // Reset filter when trait type changes
    setFilter('')
  }, [props.traitIndex]);

  // On hold until assets package is updated
  // const getPart = (partType: string, partIndex: number) => {
  //   const data = getPartData(partType, partIndex);
  //   const image = `data:image/svg+xml;base64,${btoa(buildSVG([{ data }], imageData.palette))}`;
  //   return { image };
  // }; 

  return (
    <>
      <div className="mb-4">
        <input 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
          type="text" 
          placeholder={`Search ${traitTitles[props.traitIndex].toLowerCase()}`}
          value={filter}
          onChange={event => setFilter(event.target.value)}
        />
      </div>      
      <div className="grid grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-5">
        {traitNames[props.traitIndex].filter(f => f.includes(filter.toLowerCase()) || filter === '')
          .map(f => 
            <button 
              key={f}
              className={cx("text-left", props.requestSeed?.traitName === f && "border-2 border-blue-500")}
              onClick={() => props.setRequestSeed({traitName: f})}
            >
              {/* Placeholder for trait image */}
              <img src="https://placeimg.com/320/320/nature" alt="" className="w-full aspect-square rounded" />
              <p className="text-sm capitalize">{parseTraitName(f)}</p>
            </button>
          )}
      </div>
    </>
  );
}

export default TraitTab;
