import { useMemo } from "react";
import { useAccount, useContractRead } from "wagmi";
import { NounSeed } from "../types";
import { nounScoutContract } from "../config";
import { getTraitTraitNameAndImageData } from "../utils";
import { utils, constants, BigNumber } from "ethers";
import { useAppContext } from "../context/state";
import { nounsTokenContract } from "../config";
import { useContractReads } from "wagmi";


type useGetNounSeedProps = {
  nounId: number;
};

export default function useGetNounSeed(
  props: useGetNounSeedProps
): NounSeed {


  const { data } = useContractRead({
    address: nounsTokenContract.address,
    abi: nounsTokenContract.abi,
    functionName: "seeds",
    args: [BigNumber.from(props.nounId)],
  });

  if (!data) return {} as NounSeed;

  return data as NounSeed
}
