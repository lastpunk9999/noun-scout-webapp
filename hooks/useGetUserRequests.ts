import { useMemo } from "react";
import { useAccount, useContractRead } from "wagmi";
import { Request, RequestStatus } from "../types";
import { nounScoutContract } from "../config";
import { getTraitTraitNameAndImageData } from "../utils";
import { utils, constants } from "ethers";
export default function useGetUserRequests(): Request[] {
  const { address } = useAccount();
  const addr = address ? utils.getAddress(address) : constants.AddressZero;

  const requests = useContractRead({
    address: nounScoutContract.address,
    abi: nounScoutContract.abi,
    functionName: "requestsByAddress",
    args: [addr],
    enabled: address != undefined,
  }).data;

  return useMemo(() => {
    if (!requests) return [];
    return requests.map((request) => {
      return {
        id: request.id.toNumber(),
        nounId: request.nounId,
        status: request.status,
        trait: getTraitTraitNameAndImageData(request.trait, request.traitId),
        pledge: {
          to: request.recipientId,
          amount: request.amount,
        },
      };
    });
  }, [requests]);
}
