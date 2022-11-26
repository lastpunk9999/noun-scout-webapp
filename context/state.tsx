import { createContext, useContext, useState } from 'react';
import { useContractRead, useContractReads } from 'wagmi';
import { nounSeekContract } from '../config';

const AppContext = createContext<readonly{}[]>([{}]);

export function AppWrapper({ children }) {

  const { data } = useContractReads({
    contracts: [
      {
        address: nounSeekContract.address,
        abi: nounSeekContract.abi,
        functionName: 'donees',
      },
      {
        address: nounSeekContract.address,
        abi: nounSeekContract.abi,
        functionName: 'donationsAndReimbursementForPreviousNoun',
      },
    ],
  });

  return (
    <AppContext.Provider value={data}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}