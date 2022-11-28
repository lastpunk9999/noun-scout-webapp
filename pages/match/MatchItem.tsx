import { Donation, NounSeed, TraitNameAndImageData } from "../../types";
import RequestCard from "../../components/RequestCard";
import { BigNumber, utils } from "ethers";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import { nounSeekContract } from "../../config";
import { useState } from "react";
import cx from "classnames";
import Link from "next/link";
import { traitTypeNamesById } from "../../utils";
import { ImageData } from "@nouns/assets";

type MatchItemProps = {
  donations: readonly BigNumber[];
  traitTypeId: number;
  traitId: number;
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

  const donationData = props.donations.map((donation, index) => {
    if (utils.formatEther(donation) !== '0.0') {
      return {
        to: index,
        amount: donation
      }
    }
  });
  
  const traitReimbursmentTotal = () => {
    let totalAmount = BigNumber.from(0);
    donationData.map(donation => {
      // reimbursmentAmount = donation ? reimbursmentAmount + Number(utils.formatEther(donation.amount)) : 0;
      if (donation && utils.formatEther(donation.amount) !== "0.0") {
        totalAmount = totalAmount.add(donation.amount);
      }
    })
    const reimbursmentAmount = (Number(utils.formatEther(totalAmount)) * 0.01).toFixed(4);
    return reimbursmentAmount;
  }

  const buildTraitFromIds = (traitTypeId: number, traitId: number) => {
    const traitTypeNames = traitTypeNamesById(traitTypeId);
    const trait: TraitNameAndImageData = {
      name: ImageData.images[traitTypeNames[1]][traitId].filename,
      traitId: traitId,
      traitTypeId: traitTypeId,
      type: traitTypeNames[0],
      imageData: ImageData.images[traitTypeNames[1]][traitId].imageData,
    }
    console.log('buildTrait results', trait);
    return trait;
  }
  
  return (
    <div className="my-5">
      {isTransactionComplete ? (
        <div className="text-center  bg-slate-200 p-10 rounded-lg">
          <p className="text-lg font-bold">Match confirmed!</p>
          <p className="underline">
            <a href={
              process.env.NEXT_PUBLIC_CHAIN_NAME === "mainnet" ? 
              `https://etherscan.io/tx/${transactionData}` : 
              `https://goerli.etherscan.io/tx/${transactionData}`
              }
              target="_blank"
            >
              View transaction
            </a>
          </p>
        </div>
      ) : (
        <div className="flex flex-row w-full gap-10 items-center justify-between">
          <div className={cx('w-full', isTransactionLoading || isLoading ? 'opacity-40' : 'opacity-100')}>
            <RequestCard 
              trait={buildTraitFromIds(props.traitTypeId, props.traitId)}
              donations={donationData}
              nounSeed={props.nounSeed}
            />
          </div>
          <div className="w-[25%] flex flex-col justify-center">
              <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-2 px-4 rounded disabled:bg-slate-400"
                disabled={!write || isLoading || isTransactionLoading}
                onClick={() => write?.()}
              >
                {isLoading || isTransactionLoading ? "Matching..." : "Match"}
              </button>
              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 text-sm px-4 py-3 rounded relative text-center" role="alert">
                  <strong className="font-bold">⌐×-×</strong> {" "}
                  <span className="block sm:inline">{errorMessage}</span>
                </div>
              )}
              {/* <p className="text-xs text-center">Reward: Ξ {utils.formatEther(traitReimbursmentTotal())}</p> */}
              <p className="text-xs text-center">Reward: Ξ {traitReimbursmentTotal()}</p>
          </div>
        </div>
      )}
      
    </div>
    
  );
}

export default MatchItem;