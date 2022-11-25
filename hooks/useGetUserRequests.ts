import { useMemo } from "react";
import { useAccount, useContractReads, useContractRead } from "wagmi";
import { Request } from "../types";
import { nounSeekContract } from "../config";
import { getTraitTraitNameAndImageData } from "../utils";
import { utils } from "ethers";
export default function useGetUserRequests(
  address: string | undefined
): Request[] {
  const addr = utils.getAddress(address);

  let { data } = useContractReads({
    contracts: [
      {
        address: nounSeekContract.address,
        abi: nounSeekContract.abi,
        // functionName: "requestsActiveByAddress",
        // requestsActiveByAddress is returning null. use requestsByAddress for now
        // note: requestsByAddress doesn't return the request id, so the rendered results and remove buttons aren't accurate
        functionName: "requestsByAddress",
        args: [addr],
        enabled: address != undefined,
      },
      {
        address: nounSeekContract.address,
        abi: nounSeekContract.abi,
        functionName: "donees",
        enabled: address != undefined,
      },
    ],
  });

  const [requests, donees] = data ?? [[], []];

  return useMemo(() => {
    console.log("requests data", requests);    
    return requests.map((request, id) => {
      if (request.trait === 0) return null;
        return {
          id: id,
          nounId: request.nounId,
          trait: getTraitTraitNameAndImageData(request.trait, request.traitId),
          donation: {
            to: request.doneeId,
            amount: request.amount,
          },
        };
    });
  }, [requests.length, donees.length]);
}
