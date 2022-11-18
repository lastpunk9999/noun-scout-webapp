import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import { utils } from "ethers";
import { nounSeekContract } from "../../config";
import useGetUserRequests from "../../hooks/useGetUserRequests";
import Link from "next/link";
import RequestCard from "../../components/RequestCard";

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

  function remove(e, id) {
    e.preventDefault();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-center">Your Requests</h1>
      {requests.length == 0 && (
        <>
          <p className="text-center">You have no sponsorships yet.</p>
          <p className="text-center"><Link href="/add">Add a sponsorship</Link></p>
        </>
      )}
      <ul className="max-w-xl mx-auto my-4 p-5 border border-slate-200 pb-4 bg-slate-100">
        {requests.map((r, i) => {
          return (
            <li className="flex flex-col md:flex-row justify-between gap-5 items-center">
              <div>
                <RequestCard 
                  key={i}
                  traitName={r.trait.name}
                  traitType={r.trait.type}
                  donations={[r.donation]}
                />

                {/* {r.nounId === 0 ? `Any Noun` : `Noun ${r.nounId}`} with{" "}
                {r.trait.name} {r.trait.type} */}
                {/* {utils.formatEther(r.donation.amount)} ETH to {r.donation.to}{" "} */}
              </div>
              <div className="text-center md:text-left md:w-1/3">
                {(i % 4 < 2) ? (
                  <div>
                    <p className="text-slate-700 text-sm font-bold">
                        This request can't be removed right now. 
                    </p>
                    <p className="text-slate-700 text-sm italic">
                      {i % 4 == 1 && "Auction Ending Soon"}
                      {i % 4 == 0 && "Request matches current Noun"}
                    </p>
                  </div>
                ) : (
                  <>
                    <button 
                      className="bg-blue-500 text-white font-bold py-2 px-4 rounded my-2 h-fit"
                      onClick={(e) => remove(e, r.id)} disabled={i % 4 < 2}
                      >
                      Remove
                    </button>
                  </>
                )}
              </div>
              

              {/* #TODO: are these error messages? */}
              {/* {i % 4 < 2 && (
                <>
                  <br />
                  <i>
                    {" "}
                    Reason: {i % 4 == 1 && "Auction Ending Soon"}
                    {i % 4 == 0 && "Request matches current Noun"}
                  </i>
                </>
              )} */}
              <br />
              <br />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Manage;
