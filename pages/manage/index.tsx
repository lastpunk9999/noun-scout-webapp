import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAccount, useContractRead } from "wagmi";
import { Request } from "../../types";
import { nounSeekContract } from "../../config";

const Manage: NextPage = () => {
  const { isConnected, isConnecting, address } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnecting || !router) return;
    if (isConnected) return;
    router.push("/");
  }, [isConnected, isConnecting, router]);

  let { data: requestsByAddress } = useContractRead({
    ...nounSeekContract,
    functionName: "requestsActiveByAddress",
    args: [address],
    enabled: address != undefined,
  });

  if (!isConnected) return null;
  return <div>User Requests</div>;
};

export default Manage;
