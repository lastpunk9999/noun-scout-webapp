import { useEffect, useState } from "react";
import cx from "classnames";
import { Request } from "../../types";
import useGetDoneeDescription from "../../hooks/useGetDoneeDescription";

type DoneeProps = {
  doneeId: number;
  requestSeed: Request;
  setRequestSeed: Function;
};

const Donee = (props: DoneeProps) => {
  const doneeDescription = useGetDoneeDescription(props.doneeId);
  return (
    <button
      className={cx(
        "flex gap-5 text-left p-3",
        props.requestSeed?.donation?.to === props.doneeId &&
          "bg-white shadow-lg border-2 opacity-100",
        props.requestSeed?.donation?.to &&
          props.requestSeed?.donation?.to !== props.doneeId
          ? "opacity-50 hover:opacity-80"
          : ""
      )}
      onClick={() =>
        props.setRequestSeed((request) => ({
          trait: request.trait,
          donation: {
            // to: props.requestSeed?.donation?.to !== doneeDescription.to ? doneeDescription.to : undefined,
            to: props.doneeId,
            amount: props.requestSeed?.donation?.amount,
          },
        }))
      }
    >
      <img src={doneeDescription.image} alt="" className="w-20 h-20 rounded" />
      <div>
        <h4 className="text-lg font-bold">{doneeDescription.name}</h4>
        <p>{doneeDescription.description}</p>
      </div>
      <div>
        <div
          className={cx(
            "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
            props.requestSeed?.donation?.to &&
              props.requestSeed?.donation?.to !== props.doneeId &&
              "bg-slate-300",
            props.requestSeed?.donation?.to === props.doneeId &&
              "border-blue-500 !bg-white border-2 text-blue-500 "
          )}
        >
          {props.requestSeed?.donation?.to === props.doneeId
            ? "Selected"
            : "Select"}
        </div>
      </div>
    </button>
  );
};

export default Donee;
