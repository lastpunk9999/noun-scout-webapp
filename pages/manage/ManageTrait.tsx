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

  const canRemove =
    !isTransactionComplete && props.request.status == RequestStatus.CAN_REMOVE;
  const removed =
    isTransactionComplete || props.request.status == RequestStatus.REMOVED;
  const donationSent = props.request.status == RequestStatus.DONATION_SENT;
  const matchFound = props.request.status == RequestStatus.MATCH_FOUND;
  const endingSoon = props.request.status == RequestStatus.AUCTION_ENDING_SOON;

  const { config } = usePrepareContractWrite({
    address: nounSeekContract.address,
    abi: nounSeekContract.abi,
    functionName: "remove",
    args: [BigNumber.from(props.request.id)],
    enabled: canRemove,
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

  return (
    <li className="w-full flex justify-between gap-5 items-center border border-slate-200 pb-4 bg-slate-100 p-5 rounded-lg max-w-lg text-left">
      <div className="w-full flex flex-col md:flex-col justify-between gap-5 items-center">
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
            donations={[props.request.donation]}
            cardStyle="detailed"
          />
        </div>
        <div className="text-center md:text-left md:w-1/3">
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
                {isLoading || isTransactionLoading ? "Removing..." : "Remove"}
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
                {donationSent && `Donation Sent`}
              </p>
              <p>
                {donationSent && `Thanks for sponsoring!`}
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
