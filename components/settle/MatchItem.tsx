import { Pledge, NounSeed, TraitNameAndImageData } from "../../types";
import RequestCard from "../RequestCard";
import { BigNumber, constants, utils } from "ethers";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { nounScoutContract } from "../../config";
import { useMemo, useState } from "react";
import cx from "classnames";
import Link from "next/link";
import { getTraitTraitNameAndImageData } from "../../utils";
import { useAppContext } from "../../context/state";
import NounChatBubble from "../NounChatBubble";
import Modal from "../Modal";

type MatchItemProps = {
  nounId: number;
  hideSettle?: boolean;
  pledges: readonly BigNumber[];
  reimbursement?: BigNumber;
  reimbursementBPS?: BigNumber;
  traitTypeId: number;
  traitId: number;
  nounSeed: NounSeed;
  onComplete?: (traitTypeId: number) => void;
};

function _isAuctionedNoun(nounId: number) {
  return nounId % 10 > 0 || nounId > 1820;
}

const MatchItem = (props: MatchItemProps) => {
  const { lazyUpdateState } = useAppContext();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [transactionData, setTransactionData] = useState<`0x${string}`>();
  const [isTransactionLoading, setIsTransactionLoading] =
    useState<boolean>(false);
  const [isTransactionComplete, setIsTransactionComplete] =
    useState<boolean>(false);

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const handleModal = () => {
    setModalContent(
      <div className="bg-white w-full rounded-lg border border-slate-200 relative shadow-sm hover:shadow-lg transition-shadow text-center">
        <div className="p-10">
          <h2>Don't get frontrun</h2>
          <p>
            It is highly recommended that you use{" "}
            <a
              href="https://docs.flashbots.net/flashbots-protect/rpc/quick-start#how-to-use-flashbots-protect-rpc-in-metamask"
              target="_blank"
            >
              Flashbots Protect RPC
            </a>{" "}
            with your wallet so you don't get frontrun by MEV bots.
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-5 py-2 px-4 rounded disabled:bg-slate-400"
            onClick={() => {
              setShowModal(false);
              write?.();
            }}
          >
            I'm ready, let's settle
          </button>
        </div>
      </div>
    );
    setShowModal(!showModal);
  };

  const reimbursementBPS = useMemo(() => {
    if (props.reimbursementBPS) return props.reimbursementBPS;
    if (!props.reimbursement) return constants.Zero;
    const total = props.pledges.reduce((sum, pledge) => sum.add(pledge));
    return props.reimbursement.mul("10000").div(total);
  }, [props.pledges, props.reimbursement, props.reimbursementBPS]);

  // turn list of BigNumbers into Pledge records, filter out pledges with zero amount
  const pledges = useMemo(
    () =>
      props.pledges
        .map((pledge, index) => {
          return {
            to: index,
            amount: pledge,
          };
        })
        .filter((data) => !data.amount.isZero()),
    [props.pledges]
  );

  const { config } = usePrepareContractWrite({
    address: nounScoutContract.address,
    abi: nounScoutContract.abi,
    functionName: "settle",
    args: [
      props.traitTypeId,
      _isAuctionedNoun(props.nounId),
      pledges.map((d) => d.to),
    ], // trait type ID, Noun ID, Recipient IDs
    onSuccess() {
      setErrorMessage(undefined);
    },
    onError(error) {
      console.log("Error", error);
      const message = error?.message
        ? error.message.split(/\(|\[/)[0]
        : "Something went wrong";
      setErrorMessage(message);
    },
  });

  const { isLoading, isSuccess, write } = useContractWrite({
    ...config,
    onSuccess() {
      setIsTransactionLoading(true);
      setErrorMessage(undefined);
    },
    onSettled(settledData) {
      if (settledData) {
        setTransactionData(settledData?.hash.toString() as `0x${string}`);
      }
    },
  });

  // wait for transaction to complete and then update the UI
  useWaitForTransaction({
    hash: transactionData,
    onSuccess(data) {
      setIsTransactionComplete(true);
      setIsTransactionLoading(false);
      setErrorMessage(undefined);
      lazyUpdateState();
      props.onComplete && props.onComplete(props.traitTypeId);
    },
    onError(error) {
      const message = error?.message
        ? error.message.split(/\(|\[/)[0]
        : "Something went wrong";
      setErrorMessage(message);
    },
  });

  const trait = useMemo(() => {
    const trait = getTraitTraitNameAndImageData(
      props.traitTypeId,
      props.traitId
    );
    return trait;
  }, [props.traitTypeId, props.traitId]);

  const salutations = [
    ["A-maze-ing", 123],
    ["Out of this world", 16],
    ["You're on a roll", 82],
    ["Fan-tastic", 80],
    ["Su-purr-b", 36],
    ["Egg-cellent", 77],
  ];
  const saluation = useMemo(
    () => salutations[Math.floor(Math.random() * salutations.length)],
    []
  );

  return (
    <>
      {isTransactionComplete ? (
        <div className="text-center bg-slate-200 p-10 rounded-lg flex flex-col justify-center relative">
          <span className="py-1 px-2 bg-green-600 text-white font-bold text-sm block rounded-md absolute -top-2 -left-2 z-10">
            Settled!
          </span>

          <NounChatBubble
            info="true"
            size="large"
            className="text-left"
            head={saluation[1]}
          >
            {saluation[0]}! Donations were sent to non-profits
            <br />
            and you were rewarded {utils.formatEther(props.reimbursement)} ETH
            for helping!
          </NounChatBubble>
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
        <div
          className={cx(
            "flex flex-col md:flex-row gap-5 md:gap-10 items-center mt-0 md:mt-[35px]",
            props.reimbursement && !props.reimbursement.isZero() && "w-full"
          )}
        >
          <div
            className={cx(
              "w-full relative max-w-sm",
              isTransactionLoading || isLoading ? "opacity-40" : "opacity-100"
            )}
          >
            <span className="py-1 px-2 bg-green-600 text-white font-bold text-sm block rounded-md absolute -top-2 -left-2 z-10">
              Matched!
            </span>
            <RequestCard
              trait={trait}
              pledges={pledges}
              nounSeed={props.nounSeed}
              cardStyle={props.hideSettle ? "matching" : "settling"}
              reimbursementBPS={reimbursementBPS}
            />
          </div>
          {!props.hideSettle && props.reimbursement && (
            <div className="md:w-[25%] flex flex-col justify-center mb-5 md:mb-0">
              <p className="inline-block leading-5 grow">
                <span className="bg-slate-200 font-bold whitespace-nowrap px-2">
                  {utils.formatEther(props.reimbursement)} ETH
                </span>{" "}
                will be sent to you
              </p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-2 px-4 rounded disabled:bg-slate-400"
                disabled={!write || isLoading || isTransactionLoading}
                // onClick={() => write?.()}
                onClick={handleModal}
              >
                {isLoading || isTransactionLoading ? "Settling..." : "Settle"}
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
              {/* <p className="text-xs text-center">Reward: Ξ {utils.formatEther(traitReimbursmentTotal())}</p> */}
            </div>
          )}
        </div>
      )}
      {showModal && (
        <Modal setShowModal={setShowModal} modalContent={modalContent}></Modal>
      )}
    </>
  );
};

export default MatchItem;
