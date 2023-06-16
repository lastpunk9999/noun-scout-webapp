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
import ManageTrait from "../../components/manage/ManageTrait";
import { useAppContext } from "../../context/state";
import NounChatBubble, { nounProfiles } from "../../components/NounChatBubble";
import { traitNamesById } from "../../utils";
const Summary = (props) => {
  /* code via https://play.tailwindcss.com/bvwqlf7mwO by Surjith S M (@surjithctly) */
  const offset = props.offset ?? Math.floor(Math.random() * 15);
  return (
    <div className="py-5">
      <details className="group ">
        <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
          <span>{props.children[0]}</span>
          <span className="transition group-open:rotate-180">
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
        <p className="group-open:animate-fadeIn mt-3 text-neutral-600">
          {props.children?.map((child, i) => {
            if (i == 0) return;
            return (
              <NounChatBubble size="small" {...nounProfiles[offset + i]}>
                {child}
              </NounChatBubble>
            );
          })}
        </p>
      </details>
    </div>
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
        <div className="mx-auto mt-8 grid max-w-xl divide-y divide-neutral-200">
          <NounChatBubble info={true}>
            Want to get a specific Noun trait minted do good at the same time?
            <br />
            <Link href="/add">Make a request!</Link>
          </NounChatBubble>
        </div>
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
          <div className="mx-auto mt-8 grid max-w-xl divide-y divide-neutral-200 border-b">
            <Summary key={Math.random()}>
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
            <Summary key={Math.random()}>
              {[
                <>What does "Remove" do?</>,
                <>
                  Clicking the remove button will delete your request. The
                  pledged funds wil be withdrawn and the full amount will be
                  returned to you.
                </>,
              ]}
            </Summary>
            <Summary key={Math.random()}>
              {[
                <>Can I remove anytime?</>,
                <>Almost!</>,
                <>
                  Request removal is locked 5 minutes before the current Noun
                  auction ends. This allows players of{" "}
                  <a href="https://fomonouns.wtf/" target="_blank">
                    FOMO Nouns
                  </a>{" "}
                  and other Noun-o-clock watchers to see a consistent list of
                  requests during the minting time window.
                </>,
                <>
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
          <div className="mx-auto mt-8 grid max-w-xl divide-y divide-neutral-200  border-b">
            <Summary key={Math.random()}>
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
                  and other Noun-o-clock watchers to see a consistent list of
                  requests during the minting time window.
                </>,
              ]}
            </Summary>
            <Summary key={Math.random()}>
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
            <div className="mx-auto mt-8 grid max-w-xl divide-y divide-neutral-200  border-b">
              <Summary key={Math.random()}>
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
              <Summary key={Math.random()}>
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
              <Summary key={Math.random()} offset={10}>
                {[
                  <>When can this happen?</>,
                  <>
                    Only the previous Noun
                    {hasPrevNonAuctionedID ? "s are" : " is"} "elgible to be
                    settled." If your requests matches the previous Noun
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
                  </>,
                  <>
                    But... if your request matches the current Noun on auction{" "}
                    {currentAuctionNounId && (
                      <>({nounsWTFLink(currentAuctionNounId)})</>
                    )}{" "}
                    you will have to wait a bit longer.
                  </>,
                  <>
                    First the auction must end, the next Noun{" "}
                    {currentAuctionNounId && (
                      <>(#{currentAuctionNounId + 1}) </>
                    )}
                    must be minted, and then Noun
                    {currentAuctionNounId && <> {currentAuctionNounId}</>}{" "}
                    becomes the previous Noun and is "elgible to be settled"
                    (see my{" "}
                    <span className="capitalize">
                      {traitNamesById(3, nounProfiles[11].head).split(" ")[0]}
                    </span>{" "}
                    friend above).
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

const MountedPageGuard = (props) => {
  if (!props.isMounted) return null;
  return <Manage />;
};

export default MountedPageGuard;
