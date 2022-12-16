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
import cx from "classnames";
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

  const group = (status: RequestStatus) => {
    return (
      <ul
        className={cx(
          "mx-auto my-4 p-5 gap-10 w-full max-w-3xl items-center flex-col flex justify-center align-center"
        )}
      >
        {groupedRequests[status].map((request, i) => {
          return <ManageTrait key={i} request={request} />;
        })}
      </ul>
    );
  };

  return (
    <div className="px-4">
      <h1 className="text-3xl lg:text-5xl font-bold font-serif mb-2 text-center">
        Your Sponsorships
      </h1>
      {groupedRequests[RequestStatus.CAN_REMOVE]?.length > 0 &&
        group(RequestStatus.CAN_REMOVE)}

      {groupedRequests[RequestStatus.MATCH_FOUND]?.length > 0 && (
        <div className="text-center mt-10 pt-10 border-t-2 border-slate-300">
          <p className="font-bold text-lg max-w-lg mx-auto">
            The current Noun or the previous Noun has traits which match the
            following{" "}
            {groupedRequests[RequestStatus.MATCH_FOUND].length > 1
              ? "sponsorships. They "
              : "sponsorship. It "}
            cannot be removed yet.
          </p>
          {group(RequestStatus.MATCH_FOUND)}
        </div>
      )}

      {groupedRequests[RequestStatus.AUCTION_ENDING_SOON]?.length > 0 && (
        <div className="text-center mt-10 pt-10 border-t-2 border-slate-300">
          <p className="font-bold text-lg max-w-lg mx-auto">
            The Noun auction is ending soon. These sponsorships cannot be
            removed until the auction is settled.
          </p>
          {group(RequestStatus.AUCTION_ENDING_SOON)}
        </div>
      )}

      {groupedRequests[RequestStatus.DONATION_SENT]?.length > 0 && (
        <>
          <h1 className="text-3xl font-bold mt-10 mb-2 text-center">
            Past Sponsorships
          </h1>
          {group(RequestStatus.DONATION_SENT)}
        </>
      )}
    </div>
  );
};

export default Manage;
