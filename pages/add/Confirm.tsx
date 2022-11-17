import { useState } from "react";
import RequestCard from "../../components/RequestCard";
import { RequestSeed } from "../../types";
import { nounSeekContract } from "../../config";
import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";

type ConfirmProps = {
  requestSeed: RequestSeed,
}

const Confirm = (props: ConfirmProps) => {
  console.log('requestSeed', props.requestSeed);
  const [isIdFieldVisible, setIsIdFieldVisible] = useState<boolean>(false);
  const [futureNounId, setFutureNounId] = useState<number | undefined>(undefined);
  // usePrepareContractWrite({ 
  //   contract: nounSeekContract.address, 
  //   abi: nounSeekContract.abi,
  //   functionName: 'add',
  //   args: [props.requestSeed.nounId, props.requestSeed.trait.id, props.requestSeed.donation.to, props.requestSeed.donation.amount] 
  // });

  const validate = () => {
    if (isIdFieldVisible && futureNounId > 500) {
      return true;
    }
    return false;
  }
  validate();
  return (
    <div>
      <h3 className="text-2xl font-bold text-center">Confirm Request</h3>
      <div className="max-w-lg mx-auto my-4">
        <RequestCard 
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
              placeholder="500" 
              min="500" 
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
          disabled={!validate()}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Confirm;
