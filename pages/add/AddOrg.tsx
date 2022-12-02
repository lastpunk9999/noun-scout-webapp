import { useEffect, useState } from "react";
import Link from "next/link";
import TraitTab from "./TraitTab";
import cx from "classnames";
import { ethers, utils } from "ethers";
import { nounSeekContract } from "../../config";
import { Request } from "../../types";
import { useAppContext } from "../../context/state";
import Donee from "./Donee";

type AddOrgsProps = {
  setRequestSeed: Function;
  requestSeed: Request;
};

const AddOrgs = (props: AddOrgsProps) => {
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const doneesList = useAppContext()[0];
  console.log(doneesList, "doneesList");

  useEffect(() => {
    if (amount) {
      const amountInWei = ethers.utils.parseEther(amount);
      props.setRequestSeed((request) => ({
        trait: request.trait,
        donation: {
          to: props.requestSeed?.donation?.to,
          amount: amountInWei,
        },
      }));
    }
  }, [amount]);

  return (
    <div className="flex flex-col gap-10 relative">
      <div className="prose">
        <h3 className="text-lg font-bold mb-2 text-slate-500">
          About these charities
        </h3>
        <p>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget
          lacinia odio sem nec elit. Maecenas sed diam eget risus varius blandit
          sit amet non magna. Aenean eu leo quam. Pellentesque ornare sem
          lacinia quam venenatis vestibulum.
        </p>
      </div>
      <div className="">
        <div>
          <h3 className="text-xl font-bold">Select a charity</h3>
          <div className="flex flex-col gap-10">
            {doneesList.map((org, i) => {
              return (
                <Donee
                  doneeId={i}
                  key={i}
                  requestSeed={props.requestSeed}
                  setRequestSeed={props.setRequestSeed}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOrgs;
