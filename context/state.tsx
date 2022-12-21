import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useContractRead, useContractReads } from "wagmi";
import { nounSeekContract, nounsAuctionHouseContract } from "../config";

const AppContext = createContext<readonly {}[]>({});
const contractReadConfig = [
  {
    address: nounSeekContract.address,
    abi: nounSeekContract.abi,
    functionName: "donees",
  },
  {
    address: nounSeekContract.address,
    abi: nounSeekContract.abi,
    functionName: "donationsForMatchableNoun",
  },
  {
    address: nounSeekContract.address,
    abi: nounSeekContract.abi,
    functionName: "donationsForUpcomingNoun",
  },
  {
    address: nounsAuctionHouseContract.address,
    abi: nounsAuctionHouseContract.abi,
    functionName: "auction",
  },
];

export function AppWrapper({ children }) {
  const [fetch, setFetch] = useState(false);
  const [data, setData] = useState([]);

  useContractReads({
    contracts: contractReadConfig,
    enabled: fetch,
    onSuccess(data) {
      setData(data);
    },
  });

  useEffect(() => {
    if (!fetch) setFetch(true);
  }, [fetch]);

  const state = useMemo(() => {
    return contractReadConfig.reduce(
      (state, config, i) => {
        state[config.functionName] = data[i];
        return state;
      },
      {
        update: () => setFetch(false),
      }
    );
  }, [data]);

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
