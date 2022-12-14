import { getNounData, ImageData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import { BigNumber, utils } from "ethers";
import { useMemo } from "react";
import { useContractRead } from "wagmi";
import { nounsTokenContract } from "../../config";
import MatchItem from "./MatchItem";
import Image from "next/image";

type NounWithMatchesProps = {
  nounId: number;
  donations: readonly [
    readonly BigNumber[],
    readonly BigNumber[],
    readonly BigNumber[],
    readonly BigNumber[],
    readonly BigNumber[]
  ];
  reimbursements: readonly [
    readonly BigNumber[],
    readonly BigNumber[],
    readonly BigNumber[],
    readonly BigNumber[],
    readonly BigNumber[]
  ];
};

const NounWithMatches = (props: NounWithMatchesProps) => {
  const nounSeed = useContractRead({
    address: nounsTokenContract.address,
    abi: nounsTokenContract.abi,
    functionName: "seeds",
    args: [BigNumber.from(props.nounId)],
  }).data;

  // get noun image
  const svgBase64 = useMemo(() => {
    if (!nounSeed) return;
    const { parts, background } = getNounData(nounSeed);
    const svgBinary = buildSVG(parts, ImageData.palette, background);
    return btoa(svgBinary);
  }, [nounSeed]);

  const traitsWithDonation = useMemo(() => {
    return props.donations.reduce((arr, amounts, traitTypeId) => {
      // if any donee amount is non-zero
      if (amounts.find((amount) => !amount.isZero())) {
        // add the ID to the traits array
        arr.push(traitTypeId);
      }
      return arr;
    }, []);
  }, [props.donations]);

  if (!nounSeed) return;
  return (
    <div className="my-4 p-5 border rounded-lg border-slate-200 pb-4 bg-white">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-5">
        <div className="max-w-[8rem]">
          <Image
            src={`data:image/svg+xml;base64,${svgBase64}`}
            width={320}
            height={320}
            className="w-full rounded-lg"
          />
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-3xl font-bold">Noun {props.nounId}</h3>
          <p className="text-lg leading-none">
            X sponsored traits, supporting Y charities with Z eth
          </p>
        </div>
      </div>
      <div className="flex flex-col mt-10 gap-5">
        {traitsWithDonation.map((traitTypeId) => {
          return (
            <MatchItem
              traitTypeId={traitTypeId}
              traitId={nounSeed[traitTypeId]}
              donations={props.donations[traitTypeId]}
              nounSeed={nounSeed}
              reimbursement={props.reimbursements[traitTypeId]}
            />
          );
        })}
      </div>
      {traitsWithDonation.length <= 0 && (
        <p className="text-center">No matches</p>
      )}
    </div>
  );
};

export default NounWithMatches;
