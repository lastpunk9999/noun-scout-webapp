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
        // enabled: address != undefined,
      },
      {
        // ...nounSeekContract,
        address: nounSeekContract.address,
        abi: nounSeekContract.abi,
        functionName: "donees",
        // enabled: address != undefined,
      },
    ],
    // select: (results) => transform(results[0], results[1]),
    // select: (results) => { return (results[0])},
  });

  console.log('requestsActiveByAddress', data);

  const [requests, donees] = data ?? [[], []];

  return useMemo(() => {
    console.log("requests data", requests);    
    return requests.map((request, id) => {
      if (request.trait === 0) return null;
      console.log('request data', request);
      console.log(request.id, id, request.trait, request.traitId);
      // if (request.trait && request.traitId && request.nounId > 0) {
        return {
          id: id,
          nounId: request.nounId,
          trait: getTraitTraitNameAndImageData(request.trait, request.traitId),
          donation: {
            to: donees[request.doneeId].name,
            amount: request.amount,
          },
        } as Request;
      // }
    });
  }, [requests.length, donees.length]);
}
