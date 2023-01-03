import { useEffect, useState } from "react";
import { ethers, utils } from "ethers";
import { Request } from "../../types";
import { useAppContext } from "../../context/state";

type AddAmountProps = {
  setRequestSeed: Function;
  requestSeed: Request;
};

const AddAmount = (props: AddAmountProps) => {
  const { baseReimbursementBPS, minValue: minValueBN } = useAppContext() ?? {};
  const minValue = minValueBN ? utils.formatEther(minValueBN) : "0.1";
  console.log({
    amount: props.requestSeed?.donation?.amount
      ? utils.formatEther(props.requestSeed?.donation?.amount)
      : "none",
  });
  const [amount, setAmount] = useState<string | undefined>(
    props.requestSeed?.donation?.amount &&
      utils.formatEther(props.requestSeed?.donation?.amount)
  );

  useEffect(() => {
    if (amount) {
      const amountInWei =
        amount >= minValue ? ethers.utils.parseEther(amount) : undefined;
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
    <div className="flex flex-col gap-10 relative min-h-[50vh]">
      <div>
        <h3 className="text-xl font-bold">Amount to donate</h3>
        <div className="relative mb-2 w-30">
          <span className="text-lg absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            Ξ
          </span>
          <input
            className="text-lg shadow appearance-none border rounded w-full py-2 pl-7 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
            type="number"
            placeholder={minValue}
            min={minValue}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            // onLoad={() =>
            //   setAmount(
            //     props.requestSeed?.donation?.amount
            //       ? utils.formatEther(props.requestSeed?.donation?.amount)
            //       : minValue
            //   )
            // }
          />
        </div>
        {minValue && amount < minValue && (
          <div className="text-red-700" role="alert">
            Minimum is {minValue} Ξ
          </div>
        )}
        <p className="text-sm italic opacity-80 pt-3">
          Note:
          <br />
          {baseReimbursementBPS
            ? `${100 - baseReimbursementBPS / 100}%`
            : "Most"}{" "}
          of this amount will be sent to your non-profit.
          <br />
          {baseReimbursementBPS
            ? `${baseReimbursementBPS / 100}%`
            : "a percentage"}{" "}
          will be used to pay network fees for the user who settles this
          request.
        </p>
      </div>
    </div>
  );
};

export default AddAmount;
