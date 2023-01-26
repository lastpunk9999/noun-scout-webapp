import { Pledge, NounSeed, TraitNameAndImageData } from "../../types";
import RequestCard from "../../components/RequestCard";
import { BigNumber, utils } from "ethers";
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

type MatchItemProps = {
  nounId: number;
  pledges: readonly BigNumber[];
  reimbursement: BigNumber;
  traitTypeId: BigNumber;
  traitId: number;
  nounSeed: NounSeed;
};

const MatchItem = (props: MatchItemProps) => {
  const { updateState } = useAppContext();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [transactionData, setTransactionData] = useState<string>();
  const [isTransactionLoading, setIsTransactionLoading] =
    useState<boolean>(false);
  const [isTransactionComplete, setIsTransactionComplete] =
    useState<boolean>(false);

  const reimbursementBPS = useMemo(() => {
    const total = props.pledges.reduce((sum, pledge) => sum.add(pledge));
    return props.reimbursement.mul("10000").div(total);
  }, [props.pledges, props.reimbursement]);

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
    args: [props.traitTypeId, props.nounId, pledges.map((d) => d.to)], // trait type ID, Noun ID, Recipient IDs
    onSuccess() {
      setErrorMessage(undefined);
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
      setErrorMessage(undefined);
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
      // updateState();
    },
    onError(error) {
      setErrorMessage(error?.message ?? error?.error?.message ?? "Error");
    },
  });

  const trait = useMemo(() => {
    const trait = getTraitTraitNameAndImageData(
      props.traitTypeId,
      props.traitId
    );
    return trait;
  }, [props.traitTypeId, props.traitId]);

  return (
    <>
      {isTransactionComplete ? (
        <div className="text-center bg-slate-200 p-10 rounded-lg w-full flex flex-col justify-center">
          <p className="text-lg font-bold">Settled!</p>
          <p>
            Donations were sent to non-profits and you were rewarded for
            helping!
          </p>
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
        <div className="flex flex-col md:flex-row gap-5 md:gap-10 items-center mt-0 md:mt-[35px] w-full">
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
              cardStyle="matching"
              reimbursementBPS={reimbursementBPS}
            />
          </div>
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
              onClick={() => write?.()}
            >
              {isLoading || isTransactionLoading ? "Settling..." : "Settle"}
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
            {/* <p className="text-xs text-center">Reward: Ξ {utils.formatEther(traitReimbursmentTotal())}</p> */}
          </div>
        </div>
      )}
    </>
  );
};

export default MatchItem;
