import { useMemo } from "react";
import { useAccount, useContractReads } from "wagmi";
import { Request } from "../types";
import { nounSeekContract } from "../config";
import { getTraitTraitNameAndImageData } from "../utils";
export default function useGetUserRequests(
  address: string | undefined
): Request[] {
  let { data } = useContractReads({
    contracts: [
      {
        ...nounSeekContract,
        functionName: "requestsActiveByAddress",
        args: [address],
        enabled: address != undefined,
      },
      {
        ...nounSeekContract,
        functionName: "donees",
        enabled: address != undefined,
      },
    ],
  });
  const [requests, donees] = data ?? [[], []];
  return useMemo(() => {
    return requests.map((request, id) => {
      return {
        id: request.id || id,
        nounId: request.nounId,
        trait: getTraitTraitNameAndImageData(request.trait, request.traitId),
        donation: {
          to: donees[request.doneeId].name,
          amount: request.amount,
        } as Request,
      };
    });
  }, [requests.length, donees.length]);
}