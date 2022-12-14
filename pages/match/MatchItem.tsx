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
  donations: readonly BigNumber[];
  reimbursement: BigNumber;
  traitTypeId: number;
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

  const { config } = usePrepareContractWrite({
    address: nounSeekContract.address,
    abi: nounSeekContract.abi,
    functionName: "matchAndDonate",
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
  const donationData = props.donations
    .map((donation, index) => {
      return {
        to: index,
        amount: donation,
      };
    })
    .filter((data) => !data.amount.isZero());

  const trait = useMemo(() => {
    const trait = getTraitTraitNameAndImageData(
      props.traitTypeId,
      props.traitId
    );
    return trait;
  }, [props.traitTypeId, props.traitId]);

  return (
    <div>
      {isTransactionComplete ? (
        <div className="text-center bg-slate-200 p-10 rounded-lg">
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
        <div className="flex flex-col md:flex-row w-full gap-5 md:gap-10 items-center justify-between">
          <div
            className={cx(
              "w-full",
              isTransactionLoading || isLoading ? "opacity-40" : "opacity-100"
            )}
          >
            <RequestCard
              trait={trait}
              donations={donationData}
              nounSeed={props.nounSeed}
              cardStyle="matching"
            />
          </div>
          <div className="md:w-[25%] flex flex-col justify-center mb-5 md:mb-0">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-2 px-4 rounded disabled:bg-slate-400"
              disabled={!write || isLoading || isTransactionLoading}
              onClick={() => write?.()}
            >
              {isLoading || isTransactionLoading ? "Matching..." : "Match"}
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
    </div>
  );
};

export default MatchItem;
