import { getNounData, ImageData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import { BigNumber, utils } from "ethers";
import { useMemo } from "react";
import { useContractRead } from "wagmi";
import { nounsTokenContract } from "../../config";
import MatchItem from "./MatchItem";

type NounWithMatchesProps = {
  nounId: number;
  donations: readonly [
      readonly BigNumber[], 
      readonly BigNumber[], 
      readonly BigNumber[], 
      readonly BigNumber[], 
      readonly BigNumber[]
  ];
}

const NounWithMatches = (props: NounWithMatchesProps) => {
  const nounSeed = useContractRead({
    address: nounsTokenContract.address,
    abi: nounsTokenContract.abi,
    functionName: 'seeds',
    args: [BigNumber.from(props.nounId)]
  }).data;

  // get noun image
  const svgBase64 = useMemo(() => {
    if (!nounSeed) return;
    const { parts, background } = getNounData(nounSeed);
    const svgBinary = buildSVG(parts, ImageData.palette, background);
    return btoa(svgBinary);
  }, [nounSeed])

  const traitsWithDonation = [];
  props.donations.map((doneeAmounts, i) => {
    // loop through each donee to see if there are values other than 0
    // return an array of traits that have donations to match
    doneeAmounts.filter(a => !a.isZero()).length > 0 && traitsWithDonation.push(i);
  });
  return (
    <div className="max-w-4xl mx-auto my-4 p-5 border border-slate-200 pb-4 bg-slate-100">	
      <div className="flex flex-col">
        <h3 className="text-lg font-bold">Noun {props.nounId}</h3>
        <img src={`data:image/svg+xml;base64,${svgBase64}`} className="w-40 rounded-lg" />
      </div>
      {nounSeed && traitsWithDonation.map((traitTypeId) => {
        const traitDonations = props.donations[traitTypeId];
        return (
          <MatchItem 
            traitTypeId={traitTypeId}
            traitId={nounSeed[traitTypeId]}
            donations={traitDonations}
            nounSeed={nounSeed}
          />
      )})}
      {traitsWithDonation.length <= 0 && (
        <p className="text-center">No matches</p>
      )}
    </div>
    
  );
}

export default NounWithMatches;
