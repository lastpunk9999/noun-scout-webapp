import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { utils } from "ethers";
import groupby from "lodash.groupby";
import { nounScoutContract } from "../../config";
import { Request, RequestStatus } from "../../types";
import useGetUserRequests from "../../hooks/useGetUserRequests";
import Link from "next/link";
import cx from "classnames";
import ManageTrait from "./ManageTrait";
import { requestStatusToMessage } from "../../utils";
import { useAppContext } from "../../context/state";

const Manage = () => {
  const { isConnected, isConnecting } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnecting || !router) return;
    if (isConnected) return;
    router.push("/");
  }, [isConnected, isConnecting, router]);

  const requests = useGetUserRequests();

  const { pledgesForMatchableNoun, auction } = useAppContext() ?? {};

  const currentAuctionNounId = auction && auction.nounId.toNumber();
  const {
    auctionedNounId: prevAuctionedNounId,
    nonAuctionedNounId: prevNonAuctionedNounId,
  } = pledgesForMatchableNoun ?? {};

  const hasPrevNonAuctionedID =
    prevNonAuctionedNounId && prevNonAuctionedNounId < prevAuctionedNounId;

  if (!isConnected || !requests) return null;

  const groupedRequests = groupby(requests, (r) => r.status);

  if (requests.length == 0) {
    return (
      <div>
        <h1 className="text-3xl lg:text-5xl font-bold font-serif mb-2 text-center">
          You have no requests yet.
        </h1>
        <p className="text-center">
          <Link href="/add">Add a request</Link>
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

  const nounsWTFLink = (nounId: number, prefix = "#") => {
    return (
      <a
        href={`https://nouns.wtf/noun/${nounId}`}
        target="_blank"
        rel="noreferrer noopener"
        className="text-red-700"
      >
        {prefix}
        {nounId}
      </a>
    );
  };

  return (
    <div className="px-4">
      <h1 className="text-3xl lg:text-5xl font-bold font-serif mb-2 text-center">
        Your Requests
      </h1>
      {groupedRequests[RequestStatus.AUCTION_ENDING_SOON]?.length > 0 && (
        <div className="text-center mt-10 pt-10 items-center flex-col flex justify-center align-center">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-2xl"
            role="alert"
          >
            The auction for{" "}
            {currentAuctionNounId &&
              nounsWTFLink(currentAuctionNounId, "Noun ")}{" "}
            is ending soon. Your requests cannot be removed until the auction is
            settled.
          </div>
          {group(RequestStatus.AUCTION_ENDING_SOON)}
        </div>
      )}

      {groupedRequests[RequestStatus.CAN_REMOVE]?.length > 0 &&
        group(RequestStatus.CAN_REMOVE)}

      {groupedRequests[RequestStatus.MATCH_FOUND]?.length > 0 && (
        <div className="text-center mt-10 pt-10 border-t-2 border-slate-300 items-center flex-col flex justify-center align-center">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-2xl"
            role="alert"
          >
            Either the current Noun on auction{" "}
            {currentAuctionNounId && (
              <>({nounsWTFLink(currentAuctionNounId)})</>
            )}{" "}
            or the previous Noun
            {hasPrevNonAuctionedID && "s"}{" "}
            {prevNonAuctionedNounId && (
              <>
                (
                {prevNonAuctionedNounId &&
                  hasPrevNonAuctionedID &&
                  nounsWTFLink(prevNonAuctionedNounId)}
                {hasPrevNonAuctionedID && `, `}
                {prevAuctionedNounId && nounsWTFLink(prevAuctionedNounId)})
              </>
            )}{" "}
            ha
            {hasPrevNonAuctionedID ? "ve" : "s"} traits which match the
            following{" "}
            {groupedRequests[RequestStatus.MATCH_FOUND].length > 1
              ? "requests. These requests "
              : "request. This sponsorhip "}
            cannot be removed yet.
          </div>
          {group(RequestStatus.MATCH_FOUND)}
        </div>
      )}

      {groupedRequests[RequestStatus.DONATION_SENT]?.length > 0 && (
        <div className="text-center mt-10 pt-10 border-t-2 border-slate-300 items-center flex-col flex justify-center align-center">
          <h1 className="text-3xl font-bold mt-10 mb-2 text-center">
            Past Requests
          </h1>
          {group(RequestStatus.DONATION_SENT)}
        </div>
      )}
    </div>
  );
};

const MountedPageGuard: NextPage = ({ isMounted }) => {
  if (!isMounted) return null;
  return <Manage />;
};

export default MountedPageGuard;
