import { useEffect, useState } from "react";
import RequestCard from "../../components/RequestCard";
import { Request, RequestStatus } from "../../types";
import { nounSeekContract } from "../../config";
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useWaitForTransaction,
} from "wagmi";
import { BigNumber } from "ethers";
import cx from "classnames";

type ManageTraitProps = {
  request: Request;
};

const ManageTrait = (props: ManageTraitProps) => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [transactionData, setTransactionData] = useState<string>();
  const [isTransactionLoading, setIsTransactionLoading] =
    useState<boolean>(false);
  const [isTransactionComplete, setIsTransactionComplete] =
    useState<boolean>(false);

  const enabled = props.request.status == RequestStatus.CAN_REMOVE;
  const { config } = usePrepareContractWrite({
    address: nounSeekContract.address,
    abi: nounSeekContract.abi,
    functionName: "remove",
    args: [BigNumber.from(props.request.id)],
    enabled: enabled,
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
  });

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

  let statusMessage;
  switch (props.request.status) {
    case RequestStatus.AUCTION_ENDING_SOON:
      statusMessage = "Auction is ending soon.";
      break;
    case RequestStatus.DONATION_SENT:
      statusMessage = "Already matched";
      break;
    case RequestStatus.MATCH_FOUND:
      statusMessage = "Current Noun matches this request";
      break;
    case RequestStatus.REMOVED:
      statusMessage = "Already removed";
      break;
  }
  return (
    <>
      {isTransactionComplete ? (
        <div className="text-center  bg-slate-200 p-10 rounded-lg">
          <p className="text-lg font-bold">Sponsorship removed</p>
          <p className="underline">
            <a
              href={
                process.env.NEXT_PUBLIC_CHAIN_NAME === "mainnet"
                  ? `https://etherscan.io/tx/${transactionData}`
                  : `https://goerli.etherscan.io/tx/${transactionData}`
              }
              target="_blank"
            >
              View transaction
            </a>
          </p>
        </div>
      ) : (
        <div className="w-full flex flex-col md:flex-row justify-between gap-5 items-center">
          <div
            className={cx(
              "w-full",
              isTransactionLoading || isLoading ? "opacity-40" : "opacity-100"
            )}
          >
            <RequestCard
              id={props.request.nounId}
              trait={props.request.trait}
              donations={[props.request.donation]}
            />
          </div>
          <div className="text-center md:text-left md:w-1/3">
            {enabled && (
              <div className="w-full flex flex-col gap-3 justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400"
                  disabled={
                    !enabled || !write || isLoading || isTransactionLoading
                  }
                  onClick={() => write?.()}
                >
                  {isLoading ? "Removing..." : "Remove"}
                </button>
                {errorMessage && (
                  <div
                    className="bg-red-100 border border-red-400 text-red-700 text-sm px-4 py-3 rounded relative text-center"
                    role="alert"
                  >
                    <strong className="font-bold">⌐×-×</strong>{" "}
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
};

export default ManageTrait;
