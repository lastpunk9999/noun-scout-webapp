import { useEffect, useState } from "react";
import RequestCard from "../../components/RequestCard";
import { RequestSeed } from "../../types";
import { nounSeekContract } from "../../config";
import { useAccount, usePrepareContractWrite, useContractWrite, useContractRead } from "wagmi";
import { ethers, utils } from "ethers";
import { ImageData } from "@nouns/assets";

type ConfirmProps = {
  requestSeed: RequestSeed,
  setRequestSeed: Function;
}

const Confirm = (props: ConfirmProps) => {
  const doneesList = useContractRead({
    address: nounSeekContract.address,
    abi: nounSeekContract.abi,
    functionName: 'donees',
  }).data;
  const nextAuctionId = useContractRead({
    address: nounSeekContract.address,
    abi: nounSeekContract.abi,
    functionName: 'donationsForNextNoun',
    select: (data: any) => data.nextAuctionId,
  }).data;
  const minNounId = Number(nextAuctionId) + 1;

  console.log('doneesList', doneesList);
  console.log('nextAuctionId', nextAuctionId);
  const [isIdFieldVisible, setIsIdFieldVisible] = useState<boolean>(false);
  const [futureNounId, setFutureNounId] = useState<number | undefined>(undefined);

  const isValidNoun = (nounId: number) => {
    if (nounId > minNounId) {
      return true
    }
    return false;
  }

  useEffect(() => {
    if (!isIdFieldVisible) {
      setFutureNounId(undefined);
      props.setRequestSeed(request => ({ 
        trait: request.trait, 
        donation: request.donation,
        id: undefined
      }))
    }
    if (futureNounId) {
      props.setRequestSeed(request => ({ 
        trait: request.trait, 
        donation: request.donation,
        id: Number(futureNounId)
      }))
    }
  }, [futureNounId, isIdFieldVisible]);

  const traitTypes = ["bodies", "accessories", "heads", "glasses"];
  const traitTypeId = traitTypes.indexOf(props.requestSeed.trait.type.toLowerCase()) + 1;

  const traitId = ImageData.images[`${props.requestSeed.trait.type.toLowerCase()}`].findIndex(trait => {
    return trait.filename === props.requestSeed.trait.imageData.filename;
  });
  const doneeId = doneesList.findIndex(donee => {
    return donee.to === props.requestSeed.donation.to;
  });

  const { config } = usePrepareContractWrite({ 
    address: nounSeekContract.address, 
    abi: nounSeekContract.abi,
    functionName: 'add',
    args: [
      traitTypeId, // trait type ID - 0-4 (background, body, accessory, head, glasses) 
      traitId, // traitId - index of trait type array
      props.requestSeed.id || 0, // nounId - set to 0 for open id, or specify an id 
      doneeId // doneeId - index of donee array
    ], 
    overrides: {
      value: props.requestSeed.donation.amount,
    },
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config)
  console.log('data', data, isLoading, isSuccess);
  const validate = () => {
    if (isIdFieldVisible && futureNounId > minNounId) {
      return true;
    } else if (!isIdFieldVisible) {
      return true;
    }
    return false;
  }
  
  return (
    <div>
      <h3 className="text-2xl font-bold text-center">Confirm Request</h3>
      <div className="max-w-lg mx-auto my-4">
        <RequestCard 
            id={props.requestSeed.id}
            traitType={props.requestSeed?.trait?.type}
            traitName={props.requestSeed?.trait?.name}
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
              placeholder={minNounId.toString()}
              min={minNounId} 
              className="w-20 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline invalid:border-pink-500 invalid:text-pink-600" 
              value={futureNounId}
              onChange={event => setFutureNounId(Number(event.target.value))}
            />
          </>
        )}
      </div>
      <div className="flex flex-row my-4 gap-3 justify-center items-center">
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400"
          disabled={!validate() || !write}
          onClick={() => write?.()}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Confirm;
