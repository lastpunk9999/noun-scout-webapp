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
    <>
      <div className="flex flex-col gap-5">
        {traitsWithDonation.map((traitTypeId, i) => {
          return (
            <div
              key={i}
              className="p-5 border rounded-lg border-slate-200 pb-4 bg-white h-fit flex flex-col md:flex-row gap-10 items-center md:items-start justify-center w-full"
            >
              <div className="">
                <h3 className="text-xl font-bold mb-2">Noun {props.nounId}</h3>
                <div className="max-w-[5rem] md:max-w-[12rem]">
                  <Image
                    src={`data:image/svg+xml;base64,${svgBase64}`}
                    width={320}
                    height={320}
                    className="w-full rounded-lg"
                  />
                </div>
              </div>

              <MatchItem
                traitTypeId={traitTypeId}
                traitId={nounSeed[traitTypeId]}
                donations={props.donations[traitTypeId]}
                nounSeed={nounSeed}
                reimbursement={props.reimbursements[traitTypeId]}
              />
            </div>
          );
        })}
      </div>
      {traitsWithDonation.length === 0 && (
        <div className="p-5 border rounded-lg border-slate-200 pb-4 bg-white h-fit flex flex-row gap-10">
          <div className="max-w-[8rem]">
            <h3 className="text-xl font-bold mb-2">Noun {props.nounId}</h3>
            <Image
              src={`data:image/svg+xml;base64,${svgBase64}`}
              width={320}
              height={320}
              className="w-full rounded-lg"
            />
          </div>
          <div className="text-center bg-slate-200 p-10 rounded-lg w-full flex flex-col justify-center">
            <p className="text-lg font-bold">No matches</p>
          </div>
        </div>
      )}
    </>
  );
};

export default NounWithMatches;
