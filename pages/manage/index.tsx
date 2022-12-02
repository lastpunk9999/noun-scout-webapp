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

  return (
    <div>
      <h1 className="text-3xl lg:text-5xl font-bold font-serif mb-2 text-center">
        Your Sponsorships
      </h1>
      {requests.length == 0 && (
        <>
          <p className="text-center">You have no sponsorships yet.</p>
          <p className="text-center">
            <Link href="/add">Add a sponsorship</Link>
          </p>
        </>
      )}
      {Object.values(RequestStatus).map((status) => {
        if (!groupedRequests[status] || groupedRequests[status].length == 0)
          return;
        return (
          <>
            <DisabledSponsorshipsMessage
              status={status as RequestStatus}
              requestsLength={groupedRequests[status].length}
            />
            {/* <ul className="flex flex-col max-w-xl mx-auto my-4 p-5 gap-10 "> */}
            <ul className="grid md:grid-cols-2 mx-auto my-4 p-5 gap-10 ">
              {groupedRequests[status].map((request, i) => {
                return (
                  <li
                    key={i}
                    className="w-full flex justify-between gap-5 items-center border border-slate-200 pb-4 bg-slate-100 p-5 rounded-lg"
                  >
                    <ManageTrait request={request} />
                  </li>
                );
              })}
            </ul>
          </>
        );
      })}
      ;
    </div>
  );
};

export default Manage;
