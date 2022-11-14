import RequestCard from "../../components/RequestCard";
import { RequestSeed } from "../../types";

type ConfirmProps = {
  requestSeed: RequestSeed,
}

const Confirm = (props: ConfirmProps) => {
  console.log('requestSeed', props.requestSeed)
  return (
    <div className="">
        <h2 className="text-3xl font-bold text-center">Confirm Request</h2>
        <RequestCard 
            traitType={props.requestSeed?.traitType}
            traitName={props.requestSeed?.traitName}
            donations={[props.requestSeed.donation]}
        />
        <div className="flex items-center mb-4">
            <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2" />
            <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-900">Apply this request only to a specific future noun ID</label>
        </div>

        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
      </button>
    </div>
  );
}

export default Confirm;
