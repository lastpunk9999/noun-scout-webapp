import { Donation, NounSeed, TraitNameAndImageData } from "../../types";
import RequestCard from "../../components/RequestCard";
import { BigNumber, utils } from "ethers";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { nounSeekContract } from "../../config";
import { useMemo, useState } from "react";
import cx from "classnames";
import Link from "next/link";
import { getTraitTraitNameAndImageData } from "../../utils";

type MatchItemProps = {
  nounId: number;
  donations: readonly BigNumber[];
  reimbursement: BigNumber;
  traitTypeId: BigNumber;
  traitId: number;
  nounSeed: NounSeed;
};

const MatchItem = (props: MatchItemProps) => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [transactionData, setTransactionData] = useState<string>();
  const [isTransactionLoading, setIsTransactionLoading] =
    useState<boolean>(false);
  const [isTransactionComplete, setIsTransactionComplete] =
    useState<boolean>(false);

  // turn list of BigNumbers into Donation records, filter out donations with zero amount
  const donations = props.donations
    .map((donation, index) => {
      return {
        to: index,
        amount: donation,
      };
    })
    .filter((data) => !data.amount.isZero());

  const { config } = usePrepareContractWrite({
    address: nounSeekContract.address,
    abi: nounSeekContract.abi,
    functionName: "settle",
    args: [props.traitTypeId, props.nounId, donations.map((d) => d.to)], // trait type ID, Noun ID, Donee IDs
    onSuccess() {
      setErrorMessage(undefined);
    },
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
          <p className="text-lg font-bold">Match confirmed!</p>
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
              donations={donations}
              nounSeed={props.nounSeed}
              cardStyle="detailed"
            />
          </div>
          <div className="md:w-[25%] flex flex-col justify-center mb-5 md:mb-0">
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
            <p className="text-xs text-center whitespace-nowrap">
              Reward:{" "}
              <span className="whitespace-nowrap">
                Ξ {utils.formatEther(props.reimbursement)}
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default MatchItem;
