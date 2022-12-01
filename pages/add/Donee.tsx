import { useEffect, useState } from "react";
import cx from "classnames";
import { Request } from "../../types";
import useGetDoneeDescription from "../../hooks/useGetDoneeDescription";
import Image from "next/image";

type DoneeProps = {
  doneeId: number;
  requestSeed: Request;
  setRequestSeed: Function;
};

const Donee = (props: DoneeProps) => {
  const doneeDescription = useGetDoneeDescription(props.doneeId);
  console.log("doneeDescription", doneeDescription);
  return (
    <button
      className={cx(
        "flex gap-5 text-left p-3 text-left border border-transparent rounded-lg hover:shadow-md transition-shadowrelative",
        props.requestSeed?.donation?.to === props.doneeId &&
          "bg-white shadow-lg border-2 opacity-100",
        props.requestSeed?.donation?.to >= 0 &&
          props.requestSeed?.donation?.to !== props.doneeId
          ? "opacity-50 hover:opacity-80"
          : ""
      )}
      onClick={() =>
        props.requestSeed?.donation?.to === props.doneeId
          ? props.setRequestSeed((request) => ({
              trait: request.trait,
              donation: {
                to: undefined,
                amount: props.requestSeed?.donation?.amount,
              },
            }))
          : props.setRequestSeed((request) => ({
              trait: request.trait,
              donation: {
                to: props.doneeId,
                amount: props.requestSeed?.donation?.amount,
              },
            }))
      }
    >
      {doneeDescription.image && (
        <div className="w-40 rounded">
          <Image
            src={doneeDescription.image}
            alt={`${doneeDescription.name} logo`}
            layout="responsive"
            width={320}
            height={320}
          />
        </div>
      )}
      <div>
        <h4 className="text-lg font-bold">{doneeDescription.name}</h4>
        <p>{doneeDescription.description}</p>
      </div>
      <div>
        {props.requestSeed?.donation?.to === props.doneeId && (
          <div
            className={cx(
              "flex flex-row gap-2  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
              props.requestSeed?.donation?.to === props.doneeId &&
                " !bg-white  text-blue-500 "
            )}
          >
            <input type="checkbox" checked /> Selected
          </div>
        )}

        <div
          className={cx(
            "flex flex-row gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
            props.requestSeed?.donation?.to &&
              props.requestSeed?.donation?.to !== props.doneeId &&
              "bg-slate-300",
            props.requestSeed?.donation?.to === props.doneeId &&
              " !bg-white  text-blue-500 "
          )}
        >
          {props.requestSeed?.donation?.to === props.doneeId ? (
            <></>
          ) : props.requestSeed?.donation?.to === props.doneeId ? (
            "Selected"
          ) : (
            "Select"
          )}
        </div>
      </div>
    </button>
  );
};

export default Donee;
