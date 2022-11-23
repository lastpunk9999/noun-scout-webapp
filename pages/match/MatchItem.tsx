import { Donation, NounSeed } from "../../types";
import RequestCard from "../../components/RequestCard";
import { utils } from "ethers";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import { nounSeekContract } from "../../config";
import { useState } from "react";

type MatchItemProps = {
  donation: Donation;
  traitId: number;
  traitTypeId: number;
  nounSeed: NounSeed
}

const MatchItem = (props: MatchItemProps) => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [transactionData, setTransactionData] = useState<string>();
  const [isTransactionLoading, setIsTransactionLoading] = useState<boolean>(false);
  const [isTransactionComplete, setIsTransactionComplete] = useState<boolean>(false);

  const { config } = usePrepareContractWrite({ 
    address: nounSeekContract.address, 
    abi: nounSeekContract.abi,
    functionName: 'matchAndDonate',
    args: [
      props.traitTypeId, // trait type ID - 0-4 (background, body, accessory, head, glasses) 
    ], 
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

  return (
    <div className="my-5">
      <div className="flex flex-row w-full gap-10 items-center">
        <RequestCard 
          traitTypeId={props.traitTypeId}
          traitId={props.traitId}
          donations={[props.donation]}
          nounSeed={props.nounSeed}
        />
        <div>
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400"
              disabled={!write || isLoading || isTransactionLoading}
              onClick={() => write?.()}
            >
              {isLoading ? "Matching..." : "Match"}
            </button>
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 text-sm px-4 py-3 rounded relative text-center" role="alert">
                <strong className="font-bold">⌐×-×</strong> {" "}
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            )}
            <p className="text-xs text-center">Reward: Ξ{utils.formatEther(props.donation.amount)}</p>
        </div>
      </div>
    </div>
    
  );
}

export default MatchItem;
