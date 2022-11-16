import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { Donation, RequestSeed } from "../../types";
import cx from "classnames";
import RequestCard from "../../components/RequestCard";
import { ethers } from "ethers";

const Match: NextPage = () => {
  const { isConnected, isConnecting } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnecting || !router) return;
    if (isConnected) return;
    router.push("/");
  }, [isConnected, isConnecting, router]);

  const matches = [
    {
        id: 333, 
        requests: [
            {
                trait: {
                    name: "Panda",
                    type: "head",
                    imageData: {
                        filename: "panda.png",
                        data: "xxx"
                    },
                },
                donation: {
                    to: "0x123",
                    amount: ethers.BigNumber.from(1)
                }
            }, 
            {
                trait: {
                    name: "Panda",
                    type: "head",
                    imageData: {
                        filename: "panda.png",
                        data: "xxx"
                    },
                },
                donation: {
                    to: "0x321",
                    amount: ethers.BigNumber.from(1)
                }
            }, 
        ]
    },
    {
        id: 444, 
        requests: [
            {
                trait: {
                    name: "Crane",
                    type: "head",
                    imageData: {
                        filename: "crane.png",
                        data: "xxx"
                    },
                },
                donation: {
                    to: "0x9876",
                    amount: ethers.BigNumber.from(2)
                }
            }
        ]
    },
  ]

  if (!isConnected) return null;
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-center">Open Matches</h1>
      <div className="max-w-4xl mx-auto my-4 p-5 border border-slate-200 pb-4 bg-slate-100">	
        {matches.map((match) => {
            return (
                <div className="my-5">
                    <div className="flex flex-col">
                        <h3 className="text-lg font-bold">Noun {match.id}</h3>
                        <img src="https://placeimg.com/640/640/nature" className="w-40" />
                    </div>
                    {match.requests.map((request) => {
                        return (
                            <div className="flex flex-row w-full gap-10 items-center">
                                <RequestCard 
                                    traitName={request.trait.name}
                                    traitType={request.trait.type}
                                    donations={[request.donation]}
                                />
                                <div>
                                    <button 
                                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded my-2 h-fit"
                                        // match txn
                                        // onClick={() => {}}
                                    >
                                        Match
                                    </button>
                                    <p className="text-xs text-center">Reward: Ξ{request.donation.amount.toNumber() * 0.01}</p>
                                </div>
                            </div>
                        )
                    })}                
                </div>
            )
        })}
      </div>
    </div>
  );
};

export default Match;
