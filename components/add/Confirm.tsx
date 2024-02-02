import { useEffect, useState, useMemo } from "react";
import RequestCard from "../RequestCard";
import { Request, NounSeed } from "../../types";
import { nounScoutContract, nounsAuctionHouseContract } from "../../config";
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
import RequestInText from "../RequestInText";

import { useAppContext } from "../../context/state";
import NounChatBubble from "../NounChatBubble";

type ConfirmProps = {
  requestSeed: Request;
  setRequestSeed: Function;
  setCurrentStep: Function;
  currentStep: number;
  nounIdSeed?: NounSeed
};

const Confirm = (props: ConfirmProps) => {
  const { isConnected } = useAccount();
  const {
    updateState,
    baseReimbursementBPS: reimbursementBPS = 250,
    ANY_AUCTION_ID,
  } = useAppContext() ?? {};

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

  // useEffect(() => {
  //   if (
  //     isIdFieldVisible &&
  //     minNounId &&
  //     futureNounId &&
  //     futureNounId >= minNounId
  //   ) {
  //     props.setRequestSeed({
  //       id: futureNounId,
  //     });
  //   }
  // }, [futureNounId, isIdFieldVisible]);

  // useEffect(() => {
  //   if (!isIdFieldVisible) {
  //     setFutureNounId(undefined);
  //     props.setRequestSeed((request) => ({
  //       trait: request.trait,
  //       pledge: request.pledge,
  //       id: undefined,
  //     }));
  //   }
  //   if (isIdFieldVisible) {
  //     setFutureNounId(minNounId);
  //     props.setRequestSeed((request) => ({
  //       trait: request.trait,
  //       pledge: request.pledge,
  //       id: minNounId,
  //     }));
  //   }
  // }, [isIdFieldVisible]);

  const salutations = [
    ["A-maze-ing", 123],
    ["Out of this world", 16],
    ["You're on a roll", 82],
    ["That's just fan-tastic", 80],
    ["Su-purr-b", 36],
    ["Egg-cellent", 77],
  ];
  const saluation = useMemo(
    () => salutations[Math.floor(Math.random() * salutations.length)],
    []
  );

  const { config } = usePrepareContractWrite({
    address: nounScoutContract.address,
    abi: nounScoutContract.abi,
    functionName: "add",
    args: [
      props.requestSeed.trait.traitTypeId, // trait type ID - 0-4 (background, body, accessory, head, glasses)
      props.requestSeed.trait.traitId, // traitId - index of trait type array
      props.requestSeed.nounId === null
        ? ANY_AUCTION_ID
        : props.requestSeed.nounId,
      props.requestSeed.pledge.to, // recipientId - index of recipient array
    ],
    overrides: {
      value: props.requestSeed.pledge.amount,
    },
    onError(error) {
      console.log("Error", error);
      const message = error?.message
        ? error.message.split(/\(|\[/)[0]
        : "Something went wrong";
      setErrorMessage(message);
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
      updateState();
    },
    onError(error) {
      const message = error?.message
        ? error.message.split(/\(|\[/)[0]
        : "Something went wrong";
      setErrorMessage(message);
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
    <div className="flex flex-col gap-3 sm:min-h-screen justify-center py-10 px-4">
      {isTransactionComplete ? (
        <div className="text-left">
          <h1 className="text-3xl font-bold text-center">{saluation[0]}!</h1>
          <div className="mx-auto my-10 grid gap-1">
            <NounChatBubble size={"large"} head={saluation[1]}>
              Now take a screenshot and tweet your card!
            </NounChatBubble>
            <NounChatBubble size={"large"}>👇👇👇</NounChatBubble>
          </div>
          <RequestCard
            id={props.requestSeed.id}
            nounId={props.requestSeed.nounId}
            trait={props.requestSeed?.trait}
            pledges={[props.requestSeed.pledge]}
            cardStyle="tweet"
            reimbursementBPS={reimbursementBPS}
            nounIdSeed={props.nounIdSeed}
          />

          {/* <div className="flex flex-col my-5 md:flex-row gap-5 md:justify-center">
            <button
              className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400"
              onClick={() => {
                handleResetWizard();
              }}
            >
              Make another request
            </button>
            <Link href="/manage">
              <a className="no-underline inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400">
                Manage your requests
              </a>
            </Link>
          </div> */}
          {/* <div className="mx-auto mt-8 grid gap-1">
            <NounChatBubble size={"large"} head={saluation[1]}>
              {saluation[0]}! <br />
              Want to{" "}
              <a
                className="underline text-left"
                onClick={() => {
                  handleResetWizard();
                }}
              >
                make another request?
              </a>
              <br />
              Or maybe{" "}
              <Link href="/manage">
                <a className="underline">manage your requests?</a>
              </Link>
            </NounChatBubble>
          </div> */}
        </div>
      ) : (
        <>
          <div className="text-center">
            <span className="text-sm uppercase color-blue-500 opacity-70">
              step {props.currentStep + 1}
            </span>
            <h1 className="text-3xl font-bold">Confirm Request</h1>
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
                nounId={props.requestSeed.nounId}
                trait={props.requestSeed?.trait}
                pledges={[props.requestSeed.pledge]}
                cardStyle="detailed"
                reimbursementBPS={reimbursementBPS}
                nounIdSeed={props.nounIdSeed}
              />
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
                    <strong className="font-bold">❗️</strong> Ooops...{" "}
                    {errorMessage}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="mt-5 sm:md-10">
              <ConnectButton showBalance={false} />
            </div>
          )}
        </>
      )}
      {!isTransactionComplete && !isLoading && !isTransactionLoading && (
        <button
          className={cx(
            "underline text-slate-400 mt-5",
            props.currentStep < 1 && "opacity-0"
          )}
          onClick={() => props.setCurrentStep(props.currentStep - 1)}
          disabled={
            props.currentStep < 1 && props.currentStep > 3 ? true : false
          }
        >
          👈 Go Back
        </button>
      )}
      {isTransactionComplete && (
        <Link href="/all">
          <a className="mt-10 text-center underline text-slate-400">Done</a>
        </Link>
      )}
    </div>
  );
};

export default Confirm;
