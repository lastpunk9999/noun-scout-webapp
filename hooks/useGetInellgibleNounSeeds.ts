import { useMemo } from "react";
import { useAccount, useContractRead } from "wagmi";
import { Request, RequestStatus } from "../types";
import { nounScoutContract } from "../config";
import { getTraitTraitNameAndImageData } from "../utils";
import { utils, constants } from "ethers";
import { useAppContext } from "../context/state";
import { nounsTokenContract } from "../config";
import { useContractReads } from "wagmi";

export type SeedsByTrait = readonly [
  readonly number[],
  readonly number[],
  readonly number[],
  readonly number[],
  readonly number[]
];

type useGetInellgibleNounSeedsProps = {
  skipNounId?: number;
};

export default function useGetInellgibleNounSeeds(
  props?: useGetInellgibleNounSeedsProps
): SeedsByTrait {
  const { pledgesForNounOnAuction, pledgesForMatchableNoun } =
    useAppContext() ?? {};
  const nounIds = [
    ...new Set(
      [
        pledgesForNounOnAuction && pledgesForNounOnAuction[0],
        pledgesForNounOnAuction && pledgesForNounOnAuction[1],
        pledgesForMatchableNoun && pledgesForMatchableNoun[0],
        pledgesForMatchableNoun && pledgesForMatchableNoun[1],
      ]
        .filter((x) => x)
        .filter(
          (x) => x <= (pledgesForNounOnAuction ? pledgesForNounOnAuction[0] : 0)
        )
        .filter((x) => x != props?.skipNounId)
    ),
  ];

  const contracts = nounIds.map((nounId) => {
    return {
      address: nounsTokenContract.address,
      abi: nounsTokenContract.abi,
      functionName: "seeds",
      args: [nounId],
    };
  });

  const { data } = useContractReads({
    contracts,
    enabled: !!nounIds.length,
  });

  if (!data) return [[], [], [], [], []];

  //@ts-ignore
  return data.reduce((seedsByTrait, nounSeed) => {
    nounSeed.forEach((traitSeed, trait) => {
      //@ts-ignore
      if (!seedsByTrait[trait]) seedsByTrait[trait] = [];
      //@ts-ignore
      seedsByTrait[trait].push(traitSeed);
    });
    return seedsByTrait;
  }, []);
}
