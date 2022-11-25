import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { utils } from "ethers";
import { nounSeekContract } from "../../config";
import { Request } from "../../types";
import useGetUserRequests from "../../hooks/useGetUserRequests";
import Link from "next/link";
import RequestCard from "../../components/RequestCard";
import ManageTrait from "./ManageTrait";

const Manage: NextPage = () => {
  const { isConnected, isConnecting, address } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnecting || !router) return;
    if (isConnected) return;
    router.push("/");
  }, [isConnected, isConnecting, router]);

  const requests = useGetUserRequests(address);

  if (!isConnected || !requests) return null;
  console.log('requests', requests)
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-center">Your Sponsorships</h1>
      {requests.length == 0 && (
        <>
          <p className="text-center">You have no sponsorships yet.</p>
          <p className="text-center"><Link href="/add">Add a sponsorship</Link></p>
        </>
      )}
      <ul className="flex flex-col max-w-xl mx-auto my-4 p-5 gap-10 border border-slate-200 pb-4 bg-slate-100">
        {requests.map((request, i) => {
          if (request) {
            return (
              <li 
                key={i} 
                className="w-full flex flex-col md:flex-row justify-between gap-5 items-center"
              >
                <ManageTrait 
                  request={request}
                />
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};

export default Manage;
