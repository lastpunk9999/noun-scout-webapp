import { useEffect, useState } from "react";
import RequestCard from "../../components/RequestCard";
import { Request } from "../../types";
import { nounScoutContract, nounsAuctionHouseContract } from "../../config";
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import { BigNumber, ethers, utils } from "ethers";
import { ImageData } from "@nouns/assets";
import Link from "next/link";

import cx from "classnames";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import RequestInText from "../../components/RequestInText";

type ConfirmButtonProps = {
  requestSeed: Request;
  setRequestSeed: Function;
  setCurrentStep: Function;
  currentStep: number;
};

const ConfirmButton = (props: ConfirmButtonProps) => {
  const { connector: activeConnector, isConnected } = useAccount();

  const [isIdFieldVisible, setIsIdFieldVisible] = useState<boolean>(false);
  const [futureNounId, setFutureNounId] = useState<number | undefined>(
    undefined
  );
  const [errorMessage, setErrorMessage] = useState<string>();
  const [transactionData, setTransactionData] = useState<`0x${string}`>();
  const [isTransactionLoading, setIsTransactionLoading] =
    useState<boolean>(false);
  const [isTransactionComplete, setIsTransactionComplete] =
    useState<boolean>(false);

  const nextNounsAuction = useContractRead({
    address: nounsAuctionHouseContract.address,
    abi: nounsAuctionHouseContract.abi,
    functionName: "auction",
  }).data;
  const minNounId = nextNounsAuction
    ? BigNumber.from(nextNounsAuction.nounId).toNumber() + 1
    : null;

  useEffect(() => {
    if (minNounId && futureNounId && futureNounId >= minNounId) {
      props.setRequestSeed((request) => ({
        trait: request.trait,
        pledge: request.pledge,
        id: futureNounId,
      }));
    }
  }, [futureNounId]);

  useEffect(() => {
    if (!isIdFieldVisible) {
      setFutureNounId(undefined);
      props.setRequestSeed((request) => ({
        trait: request.trait,
        pledge: request.pledge,
        id: undefined,
      }));
    }
    if (isIdFieldVisible) {
      setFutureNounId(minNounId);
      props.setRequestSeed((request) => ({
        trait: request.trait,
        pledge: request.pledge,
        id: minNounId,
      }));
    }
  }, [isIdFieldVisible]);

  // prepare data to write to contract
  const { config } = usePrepareContractWrite({
    address: nounScoutContract.address,
    abi: nounScoutContract.abi,
    functionName: "add",
    args: [
      props.requestSeed.trait.traitTypeId, // trait type ID - 0-4 (background, body, accessory, head, glasses)
      props.requestSeed.trait.traitId, // traitId - index of trait type array
      //   props.requestSeed.id || 0, // nounId - set to 0 for open id, or specify an id
      0,
      props.requestSeed.pledge.to, // recipientId - index of recipient array
    ],
    overrides: {
      value: props.requestSeed.pledge.amount,
    },
    onSuccess(data) {
      console.log("Success", data);
      setErrorMessage(undefined);
    },
    onSettled(data, error) {
      console.log("Settled", { data, error });
    },
    onError(error) {
      console.log("Error", error);
      setErrorMessage(error?.message ?? error?.error?.message ?? "Error");
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
      setErrorMessage(undefined);
      props.setCurrentStep(props.currentStep + 1);
    },
    onError(error) {
      setErrorMessage(error?.message ?? error?.error?.message ?? "Error");
    },
  });

  const validate = () => {
    if (isIdFieldVisible && futureNounId >= minNounId) {
      return true;
    } else if (!isIdFieldVisible) {
      return true;
    }
    return false;
  };

  const handleResetWizard = () => {
    props.setCurrentStep(0);
    props.setRequestSeed(undefined);
  };

  return (
    <div>
      {isTransactionComplete ? (
        <div className="text-center">
          <div className="flex flex-col my-5 md:flex-row gap-5 md:justify-center">
            <button
              className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400"
              onClick={() => {
                handleResetWizard();
              }}
            >
              Sponsor another Noun trait
            </button>
            <Link href="/manage">
              <a className="inline-block !no-underline bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400">
                Manage your requests
              </a>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* <h3 className="text-3xl font-bold font-serif mb-0 text-center">
            Confirm Request
          </h3> */}
          <div
            className={cx(
              "w-full",
              isLoading || isTransactionLoading ? "opacity-40" : "opacity-100"
            )}
          ></div>
          {isConnected ? (
            <>
              <div className="flex flex-col my-4 gap-3 justify-center items-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400"
                  disabled={!write || isLoading || isTransactionLoading}
                  onClick={() => write?.()}
                >
                  {isLoading || isTransactionLoading
                    ? "Submitting..."
                    : "Submit"}
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
            </>
          ) : (
            <>
              <p>Connect your wallet to submit</p>
              <ConnectButton showBalance={false} />
            </>
          )}
        </>
      )}
      <button
        className="underline text-slate-500"
        onClick={() => props.setCurrentStep(props.currentStep - 1)}
      >
        Back
      </button>
    </div>
  );
};

export default ConfirmButton;
