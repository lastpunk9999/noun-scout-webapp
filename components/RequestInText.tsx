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
    <p className="text-center">
      If a Noun is minted with the{" "}
      {capitalizeFirstLetter(parseTraitName(props.requestSeed.trait.name))}{" "}
      {props.requestSeed.trait.type} trait{" "}
      {props.requestSeed.donation.amount
        ? `${utils.formatEther(props.requestSeed.donation.amount)} eth`
        : "a donation"}{" "}
      will be sent to{" "}
      {props.requestSeed.donation.to ? doneeDescription.title : "charity"}
    </p>
  );
};

export default RequestInText;
