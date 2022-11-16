import { useState } from "react";
import Link from "next/link";
import { BigNumber, utils } from "ethers";
import { Donation } from "../types";
import Image from "next/image";
import placeholder from "../public/320.png";

type RequestCardProps = {
  traitType: string;
  traitName: string;
  donations: Donation[];
}

const RequestCard = (props: RequestCardProps) => {
  console.log('props', props)
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg p-3 flex gap-3">
        <div className="w-1/4">
          {/* Trait image */}
          <img src="https://placeimg.com/320/320/nature" alt="" className="w-full aspect-square rounded" />
        </div>
        <div className="w-3/4">
          <p className="text-slate-500 text-sm leading-none capitalize">{props.traitType}</p>
          <h3 className="text-xl font-bold leading-none capitalize">{props.traitName}</h3>
          <hr className="my-2 border-slate-500/25" /> 
          <p className="text-slate-500 text-sm mb-1">Supporting</p>
          <ul className="flex gap-4">
            {props.donations.map((data) => {
              console.log('data', data);
              return (
                <li 
                  key={data.to} 
                  className="flex justify-center items-center gap-2"
                >
                  <div className="w-[42px]">
                    <img src="https://placeimg.com/320/320/nature" alt="" className="w-full aspect-square rounded-full" />
                  </div>
                  <div className="">
                    <p className="text-sm font-bold leading-none">
                      {data.to}
                    </p>
                    <p className="text-slate-500 text-sm leading-none">
                      {utils.formatEther(data.amount)} ETH
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>      
    </div>
  );
}

export default RequestCard;
