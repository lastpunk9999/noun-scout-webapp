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

  const manyMatchesFound =
    groupedRequests[RequestStatus.MATCH_FOUND]?.length > 1;

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
        className="text-blue-700"
      >
        {prefix}
        {nounId}
      </a>
    );
  };

  return (
    <div className="px-4">
      {groupedRequests[RequestStatus.CAN_REMOVE]?.length > 0 && (
        <div className="text-center mt-10 pt-10 border-t-2 border-slate-300 items-center flex-col flex justify-center align-center">
          <h1 className="text-3xl font-bold mb-2 text-center">
            Your Open Requests
          </h1>
          <div
            className="text-blue-700 px-4 py-3 rounded relative max-w-2xl"
            role="alert"
          >
            <p className="text-left text-blue-700">
              {groupedRequests[RequestStatus.CAN_REMOVE]?.length > 1
                ? "These requested traits have"
                : "This requested trait has"}{" "}
              not yet been matched to a Noun. Removing a request will withdraw
              your pledged funds and return the full amount to you.
              <br />
              <h4 className="text-blue-700 font-bold underline mt-1 text-center">
                Can I remove anytime?
              </h4>
              Almost! Request removal is locked 5 minutes before the current
              Noun auction ends. This allows players of{" "}
              <a href="https://fomonouns.wtf/" target="_blank">
                FOMO Nouns
              </a>{" "}
              to see a consistent list of requests during the minting time
              window. It is also locked if a Noun with your trait is minted.
            </p>
          </div>
          {group(RequestStatus.CAN_REMOVE)}
        </div>
      )}

      {groupedRequests[RequestStatus.AUCTION_ENDING_SOON]?.length > 0 && (
        <div className="text-center mt-10 pt-10 border-t-2 border-slate-300 items-center flex-col flex justify-center align-center">
          <h1 className="text-3xl font-bold mb-2 text-center">
            Locked Requests
          </h1>
          <div
            className="text-blue-700 px-4 py-3 rounded relative max-w-2xl"
            role="alert"
          >
            <h4 className="text-blue-700 font-bold underline mt-1">
              Why are requests locked?
            </h4>
            <p className="text-left text-blue-700">
              The auction for{" "}
              {currentAuctionNounId &&
                nounsWTFLink(currentAuctionNounId, "Noun ")}{" "}
              is ending soon. Your requests cannot be removed until the auction
              is over and the next Noun is minted. This allows players of{" "}
              <a href="https://fomonouns.wtf/" target="_blank">
                FOMO Nouns
              </a>{" "}
              to see a consistent list of requests during the minting time
              window.
            </p>
            <h4 className="text-blue-700 font-bold underline mt-1">
              The good news
            </h4>
            <p className="text-left text-blue-700">
              Your request will influence minting the next Noun. If that
              happens, your pledged ETH gets donated to a good cause. And if
              that doesn't happen, you can remove your request in a few minutes.
            </p>
          </div>
          {group(RequestStatus.AUCTION_ENDING_SOON)}
        </div>
      )}

      {groupedRequests[RequestStatus.MATCH_FOUND]?.length > 0 && (
        <div className="text-center mt-10 pt-10 border-t-2 border-slate-300 items-center flex-col flex justify-center align-center">
          <h1 className="text-3xl font-bold mb-2 text-center">
            Matched Requests
          </h1>
          <div
            className="text-blue-700 px-4 py-3 rounded relative max-w-2xl"
            role="alert"
          >
            {/* <h4 className="text-blue-700 font-bold underline mt-1">Why?</h4> */}
            <p className="text-left text-blue-700">
              Nice work! Either the current Noun on auction{" "}
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
              {hasPrevNonAuctionedID ? "ve" : "s"} traits which match some of
              your{" "}
              {manyMatchesFound
                ? "requests. These requests "
                : "request. This request "}
              waiting to be settled and cannot be removed yet.{" "}
            </p>
            <h4 className="text-blue-700 font-bold underline mt-1">
              Can matched requests ever be removed?
            </h4>
            <p className="text-left  text-blue-700">
              Yes, but remember these are requests you made for a specific Noun
              trait. Now that a Noun with that trait is minted, we have to allow
              time for someone to settle the request (it can be you) and send
              those funds to your chosen non-profit. So:
            </p>
            <h4 className="text-blue-700 font-bold underline mt-1">
              When can this happen?
            </h4>
            <p className="text-left  text-blue-700">
              Case 1: If your requests matches the previous Noun
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
              and the request has not been{" "}
              <Link href="/settle">
                <a className="text-blue-700">settled</a>
              </Link>{" "}
              in 24 hours, it can be removed.
              <br />
              Case 2: If your request matches the current Noun on auction{" "}
              {currentAuctionNounId && (
                <>({nounsWTFLink(currentAuctionNounId)})</>
              )}
              , the auction must end, the next Noun must be minted, and then
              Case 1 applies.
            </p>
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
