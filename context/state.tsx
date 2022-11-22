import { createContext, useContext, useState } from 'react';
import { useContractRead } from 'wagmi';
import { nounSeekContract } from '../config';

const AppContext = createContext<readonly{}[]>([{}]);

export function AppWrapper({ children }) {
  const doneesList = useContractRead({
    address: nounSeekContract.address,
    abi: nounSeekContract.abi,
    functionName: 'donees',
  }).data;
  return (
    <AppContext.Provider value={doneesList}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}