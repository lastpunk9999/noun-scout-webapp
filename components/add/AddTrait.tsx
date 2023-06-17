import { useEffect, useState } from "react";
import Link from "next/link";
import TraitTab from "./TraitTab";
import cx from "classnames";
import { ImageData } from "@nouns/assets";
import NextButton from "./NextButton";
import { Request } from "../../types";
import useGetInellgibleNounSeeds, {
  SeedsByTrait,
} from "../../hooks/useGetInellgibleNounSeeds";

type AddTraitProps = {
  setRequestSeed: Function;
  requestSeed: Request;
};

const AddTrait = (props: AddTraitProps) => {
  const inellgibleNounSeedsByTrait: SeedsByTrait = useGetInellgibleNounSeeds();
  const [currentTraitType, setCurrentTraitType] = useState<number>(3);
  const orderedTraitTitles = [3, 4, 2, 1, 0]; // not showing backgrounds in tabs
  const traitTypes = [
    "Backgrounds",
    "Bodies",
    "Accessories",
    "Heads",
    "Glasses",
  ];
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    // Reset filter when trait type changes
    setFilter("");
  }, [currentTraitType]);

  return (
    <div className="">
      <div className="bg-white flex flex-col md:flex-row gap-2 my-5 flex-wrap">
        <nav className="flex flex-row grow-0">
          {orderedTraitTitles.map((traitTitleIndex, i) => {
            return (
              <button
                key={i}
                className={cx(
                  `text-gray-600 px-2 py-2 block border-b-2 border-transparent hover:text-blue-500 focus:outline-none`,
                  currentTraitType === traitTitleIndex &&
                    `text-blue-500 font-medium !border-blue-500`
                )}
                onClick={() => setCurrentTraitType(traitTitleIndex)}
              >
                {traitTypes[traitTitleIndex]}
              </button>
            );
          })}
        </nav>
        <div className="">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder={`Search ${traitTypes[currentTraitType].toLowerCase()}`}
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
        </div>
      </div>

      <TraitTab
        traitIndex={currentTraitType}
        setRequestSeed={props.setRequestSeed}
        requestSeed={props.requestSeed}
        filter={filter}
        disabledTraitIds={
          inellgibleNounSeedsByTrait &&
          inellgibleNounSeedsByTrait[currentTraitType]
        }
      />
    </div>
  );
};

export default AddTrait;
