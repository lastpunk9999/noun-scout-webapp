import { useEffect, useState } from "react";
import RequestCard from "../../components/RequestCard";
import { Request } from "../../types";
import { nounSeekContract, nounsAuctionHouseContract } from "../../config";
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import { BigNumber } from "ethers";
import Link from "next/link";

import cx from "classnames";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import RequestInText from "../../components/RequestInText";

import { useAppContext } from "../../context/state";

type ConfirmProps = {
  requestSeed: Request;
  setRequestSeed: Function;
  setCurrentStep: Function;
  currentStep: number;
};

const Confirm = (props: ConfirmProps) => {
  const { isConnected } = useAccount();
  const { updateState } = useAppContext();

  const [isIdFieldVisible, setIsIdFieldVisible] = useState<boolean>(false);
  const [futureNounId, setFutureNounId] = useState<number | undefined>(
    undefined
  );
  const [errorMessage, setErrorMessage] = useState<string>();
  const [transactionData, setTransactionData] = useState<string>();
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
        donation: request.donation,
        id: futureNounId,
      }));
    }
  }, [futureNounId]);

  useEffect(() => {
    if (!isIdFieldVisible) {
      setFutureNounId(undefined);
      props.setRequestSeed((request) => ({
        trait: request.trait,
        donation: request.donation,
        id: undefined,
      }));
    }
    if (isIdFieldVisible) {
      setFutureNounId(minNounId);
      props.setRequestSeed((request) => ({
        trait: request.trait,
        donation: request.donation,
        id: minNounId,
      }));
    }
  }, [isIdFieldVisible]);

  const { config } = usePrepareContractWrite({
    address: nounSeekContract.address,
    abi: nounSeekContract.abi,
    functionName: "add",
    args: [
      props.requestSeed.trait.traitTypeId, // trait type ID - 0-4 (background, body, accessory, head, glasses)
      props.requestSeed.trait.traitId, // traitId - index of trait type array
      0,
      props.requestSeed.donation.to, // doneeId - index of donee array
    ],
    overrides: {
      value: props.requestSeed.donation.amount,
    },
    onError(error) {
      console.log("Error", error);
      setErrorMessage(error?.message ?? error?.error?.message ?? "Error");
    },
    onSuccess() {
      setErrorMessage(undefined);
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
      updateState();
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
    <div className="flex flex-col gap-3 min-h-screen justify-center py-10 px-4">
      {isTransactionComplete ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold font-serif mb-2 text-center">
            Your sponsorship has been submitted!
          </h1>
          <RequestInText requestSeed={props.requestSeed} />
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
              <a className="no-underline inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400">
                Manage your sponsorships
              </a>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center">
            <span className="text-sm uppercase color-blue-500 opacity-70">
              step {props.currentStep + 1}
            </span>
            <h1 className="text-5xl font-bold">Confirm Sponsorship</h1>
          </div>
          <div
            className={cx(
              "w-full",
              isLoading || isTransactionLoading ? "opacity-40" : "opacity-100"
            )}
          >
            <div className="max-w-md mx-auto my-4">
              <RequestCard
                id={props.requestSeed.id}
                trait={props.requestSeed?.trait}
                donations={[props.requestSeed.donation]}
                cardStyle="detailed"
              />
            </div>
            <div className="max-w-md mx-auto">
              <RequestInText requestSeed={props.requestSeed} />
            </div>
            <div className="flex flex-row gap-3 justify-center items-center">
              {isIdFieldVisible && (
                <>
                  <label
                    htmlFor="nounID"
                    className="text-sm font-bold text-slate-900"
                  >
                    Future Noun ID
                  </label>
                  <input
                    id="nounID"
                    type="number"
                    min={minNounId}
                    className="w-20 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline invalid:border-pink-500 invalid:text-pink-600"
                    value={futureNounId}
                    onChange={(event) =>
                      setFutureNounId(Number(event.target.value))
                    }
                  />
                </>
              )}
            </div>
          </div>
          {isConnected ? (
            <>
              <div className="flex flex-col mt-4 gap-3 justify-center items-center">
                <button
                  className="text-xl bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400"
                  disabled={!write || isLoading || isTransactionLoading}
                  onClick={() => write?.()}
                >
                  {isLoading || isTransactionLoading
                    ? "Submitting..."
                    : "Submit ⌐◨-◨"}
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
        className={cx(
          "underline text-slate-400",
          props.currentStep < 1 && "opacity-0"
        )}
        onClick={() => props.setCurrentStep(props.currentStep - 1)}
        disabled={props.currentStep < 1 && props.currentStep > 3 ? true : false}
      >
        Back
      </button>
    </div>
  );
};

export default Confirm;
