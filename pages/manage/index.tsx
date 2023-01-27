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
const Summary = (props) => {
  /* code via https://play.tailwindcss.com/bvwqlf7mwO by Surjith S M (@surjithctly) */
  return (
    <div class="py-5">
      <details class="group">
        <summary class="flex cursor-pointer list-none items-center justify-between font-medium">
          <span>{props.children[0]}</span>
          <span class="transition group-open:rotate-180">
            <svg
              fill="none"
              height="24"
              shape-rendering="geometricPrecision"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              width="24"
            >
              <path d="M6 9l6 6 6-6"></path>
            </svg>
          </span>
        </summary>
        <p class="group-open:animate-fadeIn mt-3 text-neutral-600">
          {props.children[1]}
        </p>
      </details>
    </div>
  );
};
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
      <div className="mx-auto px-5">
        <h1 className="mt-5 text-center text-3xl font-bold tracking-tight md:text-5xl">
          You have no requests yet.
        </h1>
        <p className="text-center">
          Want to get a specific Noun trait minted at the same time?{" "}
          <Link href="/add">Add a request!</Link>
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
        <div className="mx-auto px-5">
          <h1 className="mt-5 text-center text-3xl font-bold tracking-tight md:text-5xl">
            Open Requests
          </h1>
          <div class="mx-auto mt-8 grid max-w-xl divide-y divide-neutral-200">
            <Summary>
              {[
                <>What's this?</>,
                <>
                  It's a list of your requested traits that have not yet been
                  matched to a Noun. Your open requests will influence minting
                  the next Noun. If that happens, your pledged ETH gets donated
                  to a good cause.
                </>,
              ]}
            </Summary>
            <Summary>
              {[
                <>What does "Remove" do?</>,
                <>
                  Clicking the remove button will delete your request. The
                  pledged funds wil be withdrawn and the full amount will be
                  returned to you.
                </>,
              ]}
            </Summary>
            <Summary>
              {[
                <>Can I remove anytime?</>,
                <>
                  Almost! <br />
                  Request removal is locked 5 minutes before the current Noun
                  auction ends. This allows players of{" "}
                  <a href="https://fomonouns.wtf/" target="_blank">
                    FOMO Nouns
                  </a>{" "}
                  to see a consistent list of requests during the minting time
                  window. <br />
                  Removal is also locked if a Noun with your requested trait is
                  minted. This allows your pledged funds to be donated to your
                  chosen non-profit.
                </>,
              ]}
            </Summary>
          </div>
          {group(RequestStatus.CAN_REMOVE)}
        </div>
      )}

      {groupedRequests[RequestStatus.AUCTION_ENDING_SOON]?.length > 0 && (
        <div className="mx-auto px-5">
          <h1 className="mt-5 text-center text-3xl font-bold tracking-tight md:text-5xl">
            Locked Requests
          </h1>
          <div class="mx-auto mt-8 grid max-w-xl divide-y divide-neutral-200">
            <Summary>
              {[
                <>Why are requests locked?</>,
                <>
                  The auction for{" "}
                  {currentAuctionNounId &&
                    nounsWTFLink(currentAuctionNounId, "Noun ")}{" "}
                  is ending soon. Your requests cannot be removed until the
                  auction is over and the next Noun is minted. This allows
                  players of{" "}
                  <a href="https://fomonouns.wtf/" target="_blank">
                    FOMO Nouns
                  </a>{" "}
                  to see a consistent list of requests during the minting time
                  window.
                </>,
              ]}
            </Summary>
            <Summary>
              {[
                <>The good news</>,
                <>
                  Your request will influence minting the next Noun. If that
                  happens, your pledged ETH gets donated to a good cause. And if
                  that doesn't happen, you can remove your request in a few
                  minutes.
                </>,
              ]}
            </Summary>
          </div>
          {group(RequestStatus.AUCTION_ENDING_SOON)}
        </div>
      )}
      {groupedRequests[RequestStatus.MATCH_FOUND]?.length > 0 && (
        <>
          {groupedRequests[RequestStatus.CAN_REMOVE]?.length > 0 && <hr />}
          <div className="mx-auto px-5">
            <h1 className="mt-5 text-center text-3xl font-bold tracking-tight md:text-5xl">
              Matched Requests
            </h1>
            <div class="mx-auto mt-8 grid max-w-xl divide-y divide-neutral-200">
              <Summary>
                {[
                  <>What's this?</>,
                  <>
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
                        {prevAuctionedNounId &&
                          nounsWTFLink(prevAuctionedNounId)}
                        )
                      </>
                    )}{" "}
                    ha
                    {hasPrevNonAuctionedID ? "ve" : "s"} traits which match some
                    of your{" "}
                    {manyMatchesFound
                      ? "requests. These requests "
                      : "request. This request "}
                    waiting to be settled and cannot be removed yet.{" "}
                  </>,
                ]}
              </Summary>
              <Summary>
                {[
                  <>Can matched requests ever be removed?</>,
                  <>
                    {" "}
                    Yes, but remember these are requests you made for a specific
                    Noun trait. Now that a Noun with that trait is minted, we
                    have to allow time for someone to settle the request (it can
                    be you) and send those funds to your chosen non-profit.
                  </>,
                ]}
              </Summary>
              <Summary>
                {[
                  <>When can this happen?</>,
                  <>
                    Case 1: If your requests matches the previous Noun
                    {hasPrevNonAuctionedID && "s"}{" "}
                    {prevNonAuctionedNounId && (
                      <>
                        (
                        {prevNonAuctionedNounId &&
                          hasPrevNonAuctionedID &&
                          nounsWTFLink(prevNonAuctionedNounId)}
                        {hasPrevNonAuctionedID && `, `}
                        {prevAuctionedNounId &&
                          nounsWTFLink(prevAuctionedNounId)}
                        )
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
                    , the auction must end, the next Noun must be minted, and
                    then Case 1 applies.
                  </>,
                ]}
              </Summary>
            </div>
            {group(RequestStatus.MATCH_FOUND)}
          </div>
        </>
      )}

      {groupedRequests[RequestStatus.DONATION_SENT]?.length > 0 && (
        <>
          {(groupedRequests[RequestStatus.CAN_REMOVE]?.length > 0 ||
            groupedRequests[RequestStatus.MATCH_FOUND]?.length > 0 ||
            groupedRequests[RequestStatus.AUCTION_ENDING_SOON]?.length > 0) && (
            <hr />
          )}
          <div className="mx-auto px-5">
            <h1 className="mt-5 text-center text-3xl font-bold tracking-tight md:text-5xl">
              Past Requests
            </h1>
            {group(RequestStatus.DONATION_SENT)}
          </div>
        </>
      )}
    </div>
  );
};

const MountedPageGuard: NextPage = ({ isMounted }) => {
  if (!isMounted) return null;
  return <Manage />;
};

export default MountedPageGuard;
