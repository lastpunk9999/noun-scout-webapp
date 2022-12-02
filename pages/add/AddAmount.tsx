import { useEffect, useState } from "react";
import Link from "next/link";
import TraitTab from "./TraitTab";
import cx from "classnames";
import { ethers, utils } from "ethers";
import { nounSeekContract } from "../../config";
import { Request } from "../../types";
import { useAppContext } from "../../context/state";
import Donee from "./Donee";

type AddAmountProps = {
  setRequestSeed: Function;
  requestSeed: Request;
};

const AddAmount = (props: AddAmountProps) => {
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const doneesList = useAppContext()[0];
  console.log(doneesList, "doneesList");

  useEffect(() => {
    if (amount) {
      const amountInWei = ethers.utils.parseEther(amount);
      props.setRequestSeed((request) => ({
        trait: request.trait,
        donation: {
          to: props.requestSeed?.donation?.to || undefined,
          amount: amountInWei,
        },
      }));
    }
  }, [amount]);

  return (
    <div className="flex flex-col gap-10 relative">
      <div>
        <h3 className="text-xl font-bold">Amount to donate</h3>
        <div className="relative mb-2 w-30">
          <span className="text-lg absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            Ξ
          </span>
          <input
            className="text-lg shadow appearance-none border rounded w-full py-2 pl-7 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
            type="number"
            placeholder={`0.1`}
            min="0.1"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            onLoad={(event) => setAmount("0.1")}
          />
        </div>
        <p className="text-sm italic opacity-70">
          Note: up to 2.5% of these funds will be used to pay network and
          matching fees
        </p>
      </div>
    </div>
  );
};

export default AddAmount;
