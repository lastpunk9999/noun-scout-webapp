import { useEffect, useState } from "react";
import RequestCard from "../../components/RequestCard";
import { Donation } from "../../types";
import { nounSeekContract } from "../../config";
import { usePrepareContractWrite, useContractWrite, useContractRead, useWaitForTransaction } from "wagmi";
import { BigNumber } from "ethers";

type ManageTraitProps = {
  requestId: number;
  type: string;
  name: string;
  donation: Donation;
  statusMessage: string | undefined;
}

const ManageTrait = (props: ManageTraitProps) => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [transactionData, setTransactionData] = useState<string>();
  const [isTransactionLoading, setIsTransactionLoading] = useState<boolean>(false);
  const [isTransactionComplete, setIsTransactionComplete] = useState<boolean>(false);

  const { config } = usePrepareContractWrite({ 
    address: nounSeekContract.address, 
    abi: nounSeekContract.abi,
    functionName: 'remove',
    // args: [BigNumber.from(props.requestId)], 
    args: [BigNumber.from(0)], 
    onError(error) {
      console.log("Error", error);
      setErrorMessage(error.error.message);
    },
  });

  const { isLoading, isSuccess, write } = useContractWrite({
    ...config, 
    onSuccess() {
      setIsTransactionLoading(true);
    },
    onSettled(settledData) {
      if (settledData) {
          setTransactionData(settledData?.hash.toString());
      }
    },
  })

  // wait for transaction to complete and then update the UI
  useWaitForTransaction({
    hash: transactionData ? transactionData : undefined,
    onSuccess(data) {
      setIsTransactionComplete(true);
      setIsTransactionLoading(false);
    },
    onError(error) {
      setErrorMessage(error.message);
    },
  });

  console.log('props', props);

  return (
    <>
      {isTransactionComplete ? (
        <div className="w-full flex flex-col p-10 bg-white rounded-lg overflow-hidden shadow-lg md:flex-row justify-between gap-5 items-center">
          <p>Sponsorship removed</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-between gap-5 items-center">
          <RequestCard 
            id={props.requestId}
            traitName={props.name}
            traitType={props.type}
            donations={[props.donation]}
            />
            <div className="text-center md:text-left md:w-1/3">
              {props.statusMessage ? (
                <div>
                  <p className="text-slate-700 text-sm font-bold">
                      This sponsorship can't be removed right now. 
                  </p>
                  <p className="text-slate-700 text-sm italic">
                    {props.statusMessage}
                  </p>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-3 justify-center">
                  <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400"
                    disabled={!write || isLoading || isTransactionLoading}
                    onClick={() => write?.()}
                  >
                    {isLoading ? "Removing..." : "Remove"}
                  </button>
                  {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 text-sm px-4 py-3 rounded relative text-center" role="alert">
                      <strong className="font-bold">⌐×-×</strong> {" "}
                      <span className="block sm:inline">{errorMessage}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
        </div>
      )}
    </>
    
  );
}

export default ManageTrait;
