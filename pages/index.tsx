import { useMemo } from "react";
import type { NextPage } from "next";
import { useContractRead, useWebSocketProvider } from "wagmi";

import nounSeekABI from "../abi/nounSeekABI";
import UserRequests from "../components/UserRequests";
import { nounSeekContract } from "../config";

const Home: NextPage = () => {
  const {
    data: donationsForNextNoun,
    isError,
    isLoading,
  }: { donationsForNextNoun: Array } = useContractRead({
    ...nounSeekContract,
    functionName: "donationsForNextNoun",
  });

  return <div></div>;
};

export default Home;
