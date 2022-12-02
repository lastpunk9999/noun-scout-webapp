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
  return (
    <p className="text-center text-lg">
      If a Noun is minted with the{" "}
      <span className="bg-slate-200 font-bold">
        {capitalizeFirstLetter(parseTraitName(props.requestSeed.trait.name))}{" "}
        {props.requestSeed.trait.type} trait
      </span>
      ,{" "}
      {props.requestSeed.donation.amount ? (
        <>
          <span className="bg-slate-200 font-bold">
            {utils.formatEther(props.requestSeed.donation.amount)} eth
          </span>
        </>
      ) : (
        "a donation"
      )}{" "}
      will be sent to{" "}
      {props.requestSeed.donation.to ? (
        <span className="bg-slate-200 font-bold">{doneeDescription.name}</span>
      ) : (
        "charity"
      )}
    </p>
  );
};

export default RequestInText;
