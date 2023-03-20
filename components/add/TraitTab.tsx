import { useEffect, useState } from "react";
import { ImageData, getPartData } from "@nouns/assets";
import cx from "classnames";
import {
  getTraitTraitNameAndImageData,
  parseTraitName,
  traitNames,
} from "../../utils";
import { Request } from "../../types";
import { buildSVG } from "@nouns/sdk";
import Image from "next/image";

type TraitTabProps = {
  traitIndex: number;
  setRequestSeed: Function;
  requestSeed: Request | undefined;
  filter: string;
};

const TraitTab = (props: TraitTabProps) => {
  const traitTypes = [
    "Backgrounds",
    "Bodies",
    "Accessories",
    "Heads",
    "Glasses",
  ];
  const getPart = (partType: string, partIndex: number) => {
    const data = getPartData(partType, partIndex);
    const image = `data:image/svg+xml;base64,${btoa(
      buildSVG([{ data }], ImageData.palette)
    )}`;
    return { image };
  };

  const selectedTraits =
    props.traitIndex > 0
      ? ImageData.images[traitTypes[props.traitIndex].toLowerCase()].map(
          (trait, index) => {
            return {
              id: index,
              filename: trait.filename,
              image: getPart(traitTypes[props.traitIndex].toLowerCase(), index)
                .image,
            };
          }
        )
      : [
          {
            id: 0,
            filename: "Cool",
            image: "",
          },
          {
            id: 1,
            filename: "Warm",
            image: "",
          },
        ];

  return (
    <>
      <div className="min-h-screen grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xxl:grid-cols-7 gap-5 items-start">
        {selectedTraits
          .filter(
            (f) =>
              f.filename.includes(props.filter.toLowerCase()) ||
              props.filter === ""
          )
          .map((f) => {
            return (
              <button
                key={f.filename}
                className={cx(
                  "group bg-white shadow-md text-left border border-transparent rounded-lg hover:shadow-lg transition-shadow relative",
                  props.requestSeed?.trait?.imageData.filename === f.filename &&
                    "bg-white !shadow-lg !border-1 !border-blue-500 opacity-100",
                  props.requestSeed?.trait?.imageData.filename &&
                    props.requestSeed?.trait?.imageData.filename !== f.filename
                    ? "opacity-50 hover:opacity-80 transition-opacity"
                    : ""
                )}
                onClick={() =>
                  props.requestSeed?.trait?.imageData.filename === f.filename
                    ? props.setRequestSeed({
                        ...props.requestSeed,
                        trait: undefined,
                        pledge: undefined,
                      })
                    : props.setRequestSeed({
                        ...props.requestSeed,
                        trait: getTraitTraitNameAndImageData(
                          props.traitIndex,
                          f.id
                        ),
                        pledge: {
                          to: props.requestSeed?.pledge?.to,
                          amount: props.requestSeed?.pledge?.amount,
                        },
                      })
                }
              >
                <div
                  className={cx(
                    "absolute top-0 right-1 hidden group-hover:block",
                    props.requestSeed?.trait?.imageData.filename ===
                      f.filename && "!block"
                  )}
                >
                  <input
                    type="checkbox"
                    readOnly
                    checked={
                      props.requestSeed?.trait?.imageData.filename ===
                      f.filename
                        ? true
                        : false
                    }
                  />
                </div>
                <div
                  className={cx(
                    "rounded-t-lg hover:rounded-b-none transition-rounded",
                    props.requestSeed?.trait?.imageData.filename ===
                      f.filename && "rounded-b-none"
                  )}
                  style={{
                    backgroundColor:
                      props.traitIndex === 0
                        ? `#${ImageData.bgcolors[f.id]}`
                        : `#${ImageData.bgcolors[1]}`,
                  }}
                >
                  {props.traitIndex === 0 ? (
                    <div className="opacity-30 relative z-10 h-100 aspect-square" />
                  ) : (
                    <div className="w-full overflow-hidden">
                      <Image
                        src={f.image}
                        layout="responsive"
                        width={320}
                        height={320}
                        alt={`${parseTraitName(f.filename)} trait`}
                        className={cx(
                          "w-full aspect-square",
                          // scale up accessory and bodies
                          (props.traitIndex === 1 || props.traitIndex === 2) &&
                            "scale-[170%] !-top-[70%]",
                          props.traitIndex === 4 &&
                            "scale-[150%] !top-[10%] !left-[3%]",
                          props.traitIndex === 3 && "!top-[20%]"
                        )}
                      />
                    </div>
                  )}
                </div>

                <p
                  className={cx(
                    "p-1 text-sm capitalize text-center text-slate-500 py-1 leading-none font-bold",
                    props.requestSeed?.trait?.imageData.filename ===
                      f.filename && "font-bold"
                  )}
                >
                  {parseTraitName(f.filename)}
                </p>
              </button>
            );
          })}
      </div>
    </>
  );
};

export default TraitTab;
