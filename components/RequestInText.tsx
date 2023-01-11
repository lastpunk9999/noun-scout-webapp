import Link from "next/link";
import { BigNumber, utils } from "ethers";
import { useAppContext } from "../context/state";
import { useEffect, useMemo } from "react";
import { Request } from "../types";
import useGetDoneeDescription from "../hooks/useGetDoneeDescription";
import { capitalizeFirstLetter, parseTraitName } from "../utils";

type RequestInTextProps = {
  requestSeed: Request;
};

const RequestInText = (props: RequestInTextProps) => {
  const doneeDescription = useGetDoneeDescription(
    props.requestSeed?.donation?.to || 0
  );
  const preposition =
    !/glasses/.test(props.requestSeed.trait.type) &&
    (/^[a,e,i,o,u]/i.test(props.requestSeed.trait.name) ? "an " : "a ");
  return (
    <p className="text-center text-lg">
      If a Noun with {preposition}
      <span className="bg-slate-200 font-bold whitespace-nowrap">
        {capitalizeFirstLetter(parseTraitName(props.requestSeed.trait.name))}
      </span>{" "}
      {props.requestSeed.trait.type} is minted,{" "}
      <span className="bg-slate-200 font-bold whitespace-nowrap">
        {props.requestSeed?.donation?.amount
          ? utils.formatEther(props.requestSeed.donation.amount)
          : "_______"}{" "}
        ETH
      </span>{" "}
      will be sent to{" "}
      <span className="bg-slate-200 font-bold whitespace-nowrap">
        {props.requestSeed.donation.to !== undefined
          ? doneeDescription.name
          : "_______"}
      </span>
    </p>
  );
};

export default RequestInText;
