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
  return (
    <button
      className={cx(
        "group bg-white shadow-md flex flex-col gap-5 h-full text-left p-3 border border-transparent rounded-lg hover:shadow-lg transition-shadow relative",
        // " text-left border border-transparent rounded-lg hover:shadow-md transition-shadow relative",
        props.requestSeed?.donation?.to === props.doneeId &&
          "bg-white !shadow-lg !border-1 !border-blue-500 opacity-100",
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
      <div className="w-20 rounded">
        <Image
          src={
            doneeDescription.image
              ? doneeDescription.image
              : "/donees/placeholder.svg"
          }
          alt={`${doneeDescription.name} logo`}
          layout="responsive"
          width={320}
          height={320}
        />
      </div>

      <div>
        {doneeDescription.name && (
          <h4 className="text-lg font-bold">{doneeDescription.name}</h4>
        )}
        {doneeDescription.description && <p>{doneeDescription.description}</p>}
      </div>

      <div
        className={cx(
          "absolute top-0 right-1 hidden group-hover:block",
          props.requestSeed?.donation?.to === props.doneeId && "!block"
        )}
      >
        <input
          type="checkbox"
          checked={
            props.requestSeed?.donation?.to === props.doneeId ? true : false
          }
        />
      </div>
      <div>
        {/* {props.requestSeed?.donation?.to === props.doneeId && (
          <div
            className={cx(
              "flex flex-row gap-2  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
              props.requestSeed?.donation?.to === props.doneeId &&
                " !bg-white  text-blue-500 "
            )}
          >
            <input type="checkbox" checked /> Selected
          </div>
        )} */}
        {/* 
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
        </div> */}
      </div>
    </button>
  );
};

export default Donee;
