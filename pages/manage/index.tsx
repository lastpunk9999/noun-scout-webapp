import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { utils } from "ethers";
import groupby from "lodash.groupby";
import { nounSeekContract } from "../../config";
import { Request, RequestStatus } from "../../types";
import useGetUserRequests from "../../hooks/useGetUserRequests";
import Link from "next/link";
import RequestCard from "../../components/RequestCard";
import ManageTrait from "./ManageTrait";
import { requestStatusToMessage } from "../../utils";

const DisabledSponsorshipsMessage = ({
  status,
  requestsLength,
}: {
  status: RequestStatus;
  requestsLength: number;
}): JSX.Element | undefined => {
  if (status == RequestStatus.CAN_REMOVE) return;
  return (
    <>
      <h2 className="text-3xl font-bold mb-2 text-center">
        {requestsLength > 1 ? "These sponsorships" : "This sponsorship"} can't
        be removed right now.
      </h2>
      <p className="text-center">
        {requestStatusToMessage(status, requestsLength)}
      </p>
    </>
  );
};

const Manage: NextPage = () => {
  const { isConnected, isConnecting } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnecting || !router) return;
    if (isConnected) return;
    router.push("/");
  }, [isConnected, isConnecting, router]);

  const requests = useGetUserRequests();

  if (!isConnected || !requests) return null;
  console.log("computed requests", requests);

  const groupedRequests = groupby(requests, (r) => r.status);

  if (requests.length == 0) {
    return (
      <div>
        <h1 className="text-3xl lg:text-5xl font-bold font-serif mb-2 text-center">
          You have no sponsorships yet.
        </h1>
        <p className="text-center">
          <Link href="/add">Add a sponsorship</Link>
        </p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-3xl lg:text-5xl font-bold font-serif mb-2 text-center">
        Your Sponsorships
      </h1>
      {groupedRequests[RequestStatus.CAN_REMOVE]?.length > 0 && (
        <ul className="flex flex-col max-w-xl mx-auto my-4 p-5 gap-10 border border-slate-200 pb-4 bg-slate-100">
          {groupedRequests[RequestStatus.CAN_REMOVE].map((request, i) => {
            return (
              <li
                key={i}
                className="w-full flex flex-col md:flex-row justify-between gap-5 items-center"
              >
                <ManageTrait request={request} />
              </li>
            );
          })}
        </ul>
      )}

      {groupedRequests[RequestStatus.MATCH_FOUND]?.length > 0 && (
        <ul className="flex flex-col max-w-xl mx-auto my-4 p-5 gap-10 border border-slate-200 pb-4 bg-slate-100">
          <p>
            The current Noun or the previous Noun has traits which match the
            following{" "}
            {groupedRequests[RequestStatus.MATCH_FOUND].length > 1
              ? "sponsorships. They "
              : "sponsorship. It "}
            cannot be removed yet.
          </p>
          {groupedRequests[RequestStatus.MATCH_FOUND].map((request, i) => {
            return (
              <li
                key={i}
                className="w-full flex flex-col md:flex-row justify-between gap-5 items-center"
              >
                <ManageTrait request={request} />
              </li>
            );
          })}
        </ul>
      )}

      {groupedRequests[RequestStatus.AUCTION_ENDING_SOON]?.length > 0 && (
        <ul className="flex flex-col max-w-xl mx-auto my-4 p-5 gap-10 border border-slate-200 pb-4 bg-slate-100">
          <p>
            The Noun auction is ending soon. These sponsorships cannot be
            removed until the auction is settled.
          </p>
          {groupedRequests[RequestStatus.AUCTION_ENDING_SOON].map(
            (request, i) => {
              return (
                <li
                  key={i}
                  className="w-full flex flex-col md:flex-row justify-between gap-5 items-center"
                >
                  <ManageTrait request={request} />
                </li>
              );
            }
          )}
        </ul>
      )}

      {groupedRequests[RequestStatus.DONATION_SENT]?.length > 0 && (
        <>
          <h1 className="text-3xl font-bold mb-2 text-center">
            Past Sponsorships
          </h1>
          <ul className="flex flex-col max-w-xl mx-auto my-4 p-5 gap-10 border border-slate-200 pb-4 bg-slate-100">
            {groupedRequests[RequestStatus.DONATION_SENT].map((request, i) => {
              return (
                <li
                  key={i}
                  className="w-full flex flex-col md:flex-row justify-between gap-5 items-center"
                >
                  <ManageTrait request={request} />
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default Manage;
