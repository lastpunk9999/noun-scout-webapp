import { useEffect, useState } from "react";
import RequestCard from "../../components/RequestCard";
import { Request, RequestStatus } from "../../types";
import { nounScoutContract } from "../../config";
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useWaitForTransaction,
} from "wagmi";
import { BigNumber } from "ethers";
import cx from "classnames";
import { useAppContext } from "../../context/state";

type ManageTraitProps = {
  request: Request;
};

const ManageTrait = (props: ManageTraitProps) => {
  const { lazyUpdateState } = useAppContext();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [transactionData, setTransactionData] = useState<`0x${string}`>();
  const [isTransactionLoading, setIsTransactionLoading] =
    useState<boolean>(false);
  const [isTransactionComplete, setIsTransactionComplete] =
    useState<boolean>(false);

  const canRemove =
    !isTransactionComplete && props.request.status == RequestStatus.CAN_REMOVE;
  const removed =
    isTransactionComplete || props.request.status == RequestStatus.REMOVED;
  const pledgeSent = props.request.status == RequestStatus.DONATION_SENT;
  const matchFound = props.request.status == RequestStatus.MATCH_FOUND;
  const endingSoon = props.request.status == RequestStatus.AUCTION_ENDING_SOON;

  const { config } = usePrepareContractWrite({
    address: nounScoutContract.address,
    abi: nounScoutContract.abi,
    functionName: "remove",
    args: [BigNumber.from(props.request.id)],
    enabled: canRemove,
    onSuccess() {
      setErrorMessage(undefined);
    },
    onError(error) {
      console.log("Error", error);
      setErrorMessage(error?.message ?? "Error");
    },
  });

  const { isLoading, isSuccess, write } = useContractWrite({
    ...config,
    onSuccess() {
      setIsTransactionLoading(true);
    },
    onSettled(settledData) {
      if (settledData) {
        setTransactionData(settledData?.hash.toString() as `0x${string}`);
      }
    },
  });

  // wait for transaction to complete and then update the UI
  useWaitForTransaction({
    hash: transactionData ? transactionData : undefined,
    onSuccess(data) {
      setIsTransactionComplete(true);
      setIsTransactionLoading(false);
      setErrorMessage(undefined);
      lazyUpdateState();
    },
    onError(error) {
      setErrorMessage(error?.message ?? "Error");
    },
  });
  let buttonText = "Remove";
  if (isLoading || isTransactionLoading) {
    buttonText = "Removing...";
  } else if (matchFound) {
    buttonText = "Matched";
  } else if (endingSoon) {
    buttonText = "Waiting...";
  }

  return (
    <li className="w-full flex justify-between gap-5 items-center border border-slate-200 pb-4 bg-white p-5 rounded-lg max-w-xl text-left">
      <div className="w-full flex flex-col md:flex-row justify-between gap-5 items-center">
        <div
          className={cx(
            "w-full",
            isTransactionComplete || isTransactionLoading || isLoading
              ? "opacity-40"
              : "opacity-100"
          )}
        >
          <RequestCard
            id={props.request.nounId}
            trait={props.request.trait}
            pledges={[props.request.pledge]}
            cardStyle={pledgeSent ? "compact" : "detailed"}
            donationSent={pledgeSent}
          />
        </div>
        <div className="text-center md:text-left">
          {(canRemove || matchFound || endingSoon) && (
            <div className="w-full flex flex-col gap-3 justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400"
                disabled={
                  !canRemove ||
                  !write ||
                  isLoading ||
                  isTransactionLoading ||
                  isTransactionComplete
                }
                onClick={() => write?.()}
              >
                {buttonText}
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
          {!canRemove && (
            <div className="text-center rounded-lg">
              <p className="text-lg font-bold">
                {removed && `Removed`}
                {pledgeSent && `Donation Sent`}
              </p>
              <p>
                {pledgeSent && `Thanks for sponsoring!`}
                {transactionData && (
                  <a
                    href={
                      process.env.NEXT_PUBLIC_CHAIN_NAME === "mainnet"
                        ? `https://etherscan.io/tx/${transactionData}`
                        : `https://goerli.etherscan.io/tx/${transactionData}`
                    }
                    target="_blank"
                    className="underline"
                  >
                    View transaction
                  </a>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default ManageTrait;
