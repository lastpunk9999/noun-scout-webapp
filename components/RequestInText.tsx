import Link from "next/link";
import { BigNumber, utils } from "ethers";
import { useAppContext } from "../context/state";
import { useEffect, useMemo } from "react";
import { Request } from "../types";
import useGetRecipientDescription from "../hooks/useGetRecipientDescription";
import {
  capitalizeFirstLetter,
  parseTraitName,
  traitPreposition,
} from "../utils";

type RequestInTextProps = {
  requestSeed: Request;
};

const RequestInText = (props: RequestInTextProps) => {
  const recipientDescription = useGetRecipientDescription(
    props.requestSeed?.pledge?.to || 0
  );
  return (
    <p className="text-center text-lg">
      If a Noun with {traitPreposition(props.requestSeed.trait)}
      <span className="bg-slate-200 font-bold whitespace-nowrap">
        {capitalizeFirstLetter(parseTraitName(props.requestSeed.trait.name))}
      </span>{" "}
      {props.requestSeed.trait.type} is minted,{" "}
      <span className="bg-slate-200 font-bold whitespace-nowrap">
        {props.requestSeed?.pledge?.amount
          ? utils.formatEther(props.requestSeed.pledge.amount)
          : "_______"}{" "}
        ETH
      </span>{" "}
      will be sent to{" "}
      <span className="bg-slate-200 font-bold whitespace-nowrap">
        {props.requestSeed.pledge.to !== undefined
          ? recipientDescription.name
          : "_______"}
      </span>
    </p>
  );
};

export default RequestInText;
