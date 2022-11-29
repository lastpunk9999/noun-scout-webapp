import { useMemo } from "react";
import { useAccount, useContractRead } from "wagmi";
import { Request, RequestStatus } from "../types";
import { nounSeekContract } from "../config";
import { getTraitTraitNameAndImageData } from "../utils";
import { utils, constants } from "ethers";
export default function useGetUserRequests(): Request[] {
  const { address } = useAccount();
  const addr = address ? utils.getAddress(address) : constants.AddressZero;

  const requests = useContractRead({
    address: nounSeekContract.address,
    abi: nounSeekContract.abi,
    functionName: "requestsByAddress",
    args: [addr],
    enabled: address != undefined,
  }).data;

  return useMemo(() => {
    if (!requests) return [];
    console.log("RAW requests data", requests);
    return requests.map((request) => {
      if (request.trait === 0) return null;
      return {
        id: request.id.toNumber(),
        nounId: request.nounId,
        status: request.status,
        trait: getTraitTraitNameAndImageData(request.trait, request.traitId),
        donation: {
          to: request.doneeId,
          amount: request.amount,
        },
      };
    });
  }, [requests]);
}
