import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useContractRead, useContractReads } from "wagmi";
import { nounScoutContract, nounsAuctionHouseContract } from "../config";
import { useRouter } from "next/router";
type State = {
  recipients?: any;
  pledgesForMatchableNoun?: any;
  pledgesForUpcomingNoun?: any;
  baseReimbursementBPS?: any;
  minValue?: any;
  auction?: any;
  updateState?: () => void;
  lazyUpdateState?: () => void;
  isMounted?: boolean;
};

// const AppContext = createContext<readonly {}[]>({});
const AppContext = createContext<State>({} as State);
const contractReadConfig = [
  {
    address: nounScoutContract.address,
    abi: nounScoutContract.abi,
    functionName: "recipients",
  },
  {
    address: nounScoutContract.address,
    abi: nounScoutContract.abi,
    functionName: "pledgesForMatchableNoun",
  },
  {
    address: nounScoutContract.address,
    abi: nounScoutContract.abi,
    functionName: "pledgesForUpcomingNoun",
  },
  {
    address: nounScoutContract.address,
    abi: nounScoutContract.abi,
    functionName: "baseReimbursementBPS",
  },
  {
    address: nounScoutContract.address,
    abi: nounScoutContract.abi,
    functionName: "minValue",
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
  return null;
}

export function AppWrapper({ children, isMounted }) {
  const router = useRouter();
  const [fetch, setFetch] = useState(false);
  const [lazyFetch, setLazyFetch] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const handleStart = (url) => {
      if (!lazyFetch) return;
      setLazyFetch(false);
      setFetch(false);
    };

    router.events.on("routeChangeStart", handleStart);

    return () => {
      router.events.off("routeChangeStart", handleStart);
    };
  }, [router, lazyFetch]);

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
        updateState: () => setFetch(false),
        lazyUpdateState: () => setLazyFetch(true),
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
