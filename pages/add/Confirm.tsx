import { useEffect, useState } from "react";
import RequestCard from "../../components/RequestCard";
import { Request } from "../../types";
import { nounSeekContract, nounsAuctionHouseContract } from "../../config";
import { usePrepareContractWrite, useContractWrite, useContractRead, useWaitForTransaction } from "wagmi";
import { BigNumber, ethers, utils } from "ethers";
import { ImageData } from "@nouns/assets";
import Link from "next/link";
import { useAppContext } from "../../context/state";
import cx from "classnames";

type ConfirmProps = {
  requestSeed: Request,
  setRequestSeed: Function;
  setCurrentStep: Function;
}

const Confirm = (props: ConfirmProps) => {
  const [isIdFieldVisible, setIsIdFieldVisible] = useState<boolean>(false);
  const [futureNounId, setFutureNounId] = useState<number | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [transactionData, setTransactionData] = useState<string>();
  const [isTransactionLoading, setIsTransactionLoading] = useState<boolean>(false);
  const [isTransactionComplete, setIsTransactionComplete] = useState<boolean>(false);
  const doneesList = useAppContext();
  const nextNounsAuction = useContractRead({
    address: nounsAuctionHouseContract.address,
    abi: nounsAuctionHouseContract.abi,
    functionName: 'auction',
  }).data;
  const minNounId = nextNounsAuction ? BigNumber.from(nextNounsAuction.nounId).toNumber() + 1 : null;

  useEffect(() => {
    if (minNounId && futureNounId && futureNounId >= minNounId) {
      props.setRequestSeed(request => ({ 
        trait: request.trait, 
        donation: request.donation,
        id: futureNounId
      }))
    }
  }, [futureNounId]);

  useEffect(() => {
    if (!isIdFieldVisible) {
      setFutureNounId(undefined);
      props.setRequestSeed(request => ({ 
        trait: request.trait, 
        donation: request.donation,
        id: undefined
      }))
    }
    if (isIdFieldVisible) {
      setFutureNounId(minNounId);
      props.setRequestSeed(request => ({ 
        trait: request.trait, 
        donation: request.donation,
        id: minNounId
      }))
    }
    
  }, [isIdFieldVisible]);

  // prepare data to write to contract
  const traitTypes = ["bodies", "accessories", "heads", "glasses"];
  const traitTypeId = traitTypes.indexOf(props.requestSeed.trait.type.toLowerCase()) + 1;
  const traitId = ImageData.images[`${props.requestSeed.trait.type.toLowerCase()}`].findIndex(trait => {
    return trait.filename === props.requestSeed.trait.imageData.filename;
  });

  const { config } = usePrepareContractWrite({ 
    address: nounSeekContract.address, 
    abi: nounSeekContract.abi,
    functionName: 'add',
    args: [
      traitTypeId, // trait type ID - 0-4 (background, body, accessory, head, glasses) 
      traitId, // traitId - index of trait type array
      props.requestSeed.id || 0, // nounId - set to 0 for open id, or specify an id 
      props.requestSeed.donation.to // doneeId - index of donee array
    ], 
    overrides: {
      value: props.requestSeed.donation.amount,
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
  })

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
  
  const validate = () => {
    if (isIdFieldVisible && futureNounId >= minNounId) {
      return true;
    } else if (!isIdFieldVisible) {
      return true;
    }
    return false;
  }

  const handleResetWizard = () => {
    props.setCurrentStep(0);
    props.setRequestSeed(undefined);
  }
  
  return (
    <div>
      {isTransactionComplete ? (
        <div className="text-center">
          <p>Your sponsorship has been submitted!</p>
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
              <a className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400">
                Manage your sponsorships
              </a>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-center">Confirm Sponsorship</h3>
          <div className={cx('w-full', isTransactionLoading || isLoading ? 'opacity-40' : 'opacity-100')}>
            <div className="max-w-lg mx-auto my-4">
              <RequestCard 
                id={props.requestSeed.id}
                trait={props.requestSeed?.trait}
                donations={[props.requestSeed.donation]}
              />
            </div>
            <div className="flex justify-center items-center mt-4">
                <input 
                  id="default-checkbox" 
                  type="checkbox" 
                  value="" 
                  className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2" 
                  onChange={() => setIsIdFieldVisible(!isIdFieldVisible)}
                />
                <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-slate-900">Apply this sponsorship only to a specific Future Noun ID</label>
            </div>
            <div className="flex flex-row mt-2 gap-3 justify-center items-center">
              {isIdFieldVisible && (
                <>
                  <label htmlFor="nounID" className="text-sm font-bold text-slate-900">Future Noun ID</label>
                  <input 
                    id="nounID" 
                    type="number" 
                    // placeholder={minNounId.toString()}
                    min={minNounId} 
                    className="w-20 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline invalid:border-pink-500 invalid:text-pink-600" 
                    value={futureNounId}
                    onChange={event => setFutureNounId(Number(event.target.value))}
                  />
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col my-4 gap-3 justify-center items-center">
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400"
              disabled={!validate() || !write || isLoading || isTransactionLoading}
              onClick={() => write?.()}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 text-sm px-4 py-3 rounded relative text-center" role="alert">
                <strong className="font-bold">⌐×-×</strong> {" "}
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Confirm;
