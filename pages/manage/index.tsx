import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import { utils } from "ethers";
import { nounSeekContract } from "../../config";
import useGetUserRequests from "../../hooks/useGetUserRequests";

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
      <h1>Your Requests</h1>
      {requests.length == 0 && "Add a request"}
      <ul>
        {requests.map((r, i) => {
          return (
            <li>
              {r.nounId === 0 ? `Any Noun` : `Noun ${r.nounId}`} with{" "}
              {r.trait.name} {r.trait.type}
              <br />
              {utils.formatEther(r.donation.amount)} ETH to {r.donation.to}{" "}
              <br />
              <button onClick={(e) => remove(e, r.id)} disabled={i % 4 < 2}>
                Remove
              </button>
              {i % 4 < 2 && (
                <>
                  <br />
                  <i>
                    {" "}
                    Reason: {i % 4 == 1 && "Auction Ending Soon"}
                    {i % 4 == 0 && "Request matches current Noun"}
                  </i>
                </>
              )}
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
