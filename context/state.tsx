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
    address: nounSeekContract.address,
    abi: nounSeekContract.abi,
    functionName: "baseReimbursementBPS",
  },
  {
    address: nounsAuctionHouseContract.address,
    abi: nounsAuctionHouseContract.abi,
    functionName: "auction",
  },
];

function UseGetData({ setData, fetch }) {
  useContractReads({
    contracts: contractReadConfig,
    enabled: fetch,
    onSuccess: setData,
  });
}

export function AppWrapper({ children, isMounted }) {
  const [fetch, setFetch] = useState(false);
  const [data, setData] = useState([]);

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
        isMounted,
      }
    );
  }, [data, isMounted]);

  return (
    <AppContext.Provider value={state}>
      {isMounted && <UseGetData setData={setData} fetch={fetch} />}
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
