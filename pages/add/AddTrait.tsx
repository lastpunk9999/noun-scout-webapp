import { useEffect, useState } from "react";
import Link from "next/link";
import TraitTab from "./TraitTab";
import cx from "classnames";
import { images } from "../../public/image-data.json";
import { ImageData } from '@nouns/assets';
import NextButton from "./NextButton";
import { RequestSeed } from "../../types";

type AddTraitProps = {
  setRequestSeed: Function;
  requestSeed: RequestSeed;
}

const AddTrait = (props: AddTraitProps) => {
  const [currentTraitType, setCurrentTraitType] = useState<number>(2);
  const traitTitles = ["Bodies", "Accessories", "Heads", "Glasses"];
  const orderedTraitTitles = [2,3,1,0];

  return (
    <div className="">
      <div className="">
        <nav className="flex flex-col sm:flex-row">
          {orderedTraitTitles.map((traitTitleIndex) => { 
            return (
              <button 
                className={cx(`text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none`, (currentTraitType === traitTitleIndex && `text-blue-500 border-b-2 font-medium border-blue-500`))}
                onClick={() => setCurrentTraitType(traitTitleIndex)}
              >
                {traitTitles[traitTitleIndex]}
              </button>
            )
          })}
          {/* <div className="mb-4">
            <input 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              type="text" 
              // placeholder={`Search ${traitTitles[props.traitIndex].toLowerCase()}`}
              // value={filter}
              // onChange={event => setFilter(event.target.value)}
            />
          </div>  */}
        </nav>
      </div>      
      
      <TraitTab 
        traitIndex={currentTraitType}
        setRequestSeed={props.setRequestSeed}
        requestSeed={props.requestSeed}
      />
    </div>
  );
}

export default AddTrait;
