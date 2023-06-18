import type { NextPage } from "next";
import NounWithMatches from "../../components/settle/NounWithMatches";
import { useAppContext } from "../../context/state";
import cx from "classnames";
import { constants, utils } from "ethers";
import { BigNumber } from "../../types";
import { useMemo } from "react";
import { effectiveBPS } from "../../utils";

type TodayPageProps = {
  asComponent?: boolean;
};

const Today = (props: TodayPageProps) => {
  const {
    pledgesForNounOnAuction: matchData,
    baseReimbursementBPS,
    minReimbursement,
    maxReimbursement,
  } = useAppContext();

  const isNonAuctionedNoun =
    matchData?.prevNonAuctionId < matchData?.currentAuctionId &&
    matchData?.prevNonAuctionId
      ? true
      : false;

  const currentAuctionReimbursementsBPS = useMemo(() => {
    if (!matchData?.currentAuctionPledges) return [];
    return matchData.currentAuctionPledges.map((pledges) => {
      const total = pledges.reduce((total: BigNumber, pledge: BigNumber) => {
        return total.add(pledge);
      }, constants.Zero);

      return effectiveBPS(
        baseReimbursementBPS,
        minReimbursement,
        maxReimbursement,
        total
      );
    });
  }, [matchData, baseReimbursementBPS, minReimbursement, maxReimbursement]);

  const prevNonAuctionReimbursementsBPS = useMemo(() => {
    if (!isNonAuctionedNoun) return [];
    return matchData.prevNonAuctionPledges.map((pledges) => {
      const total = pledges.reduce((total: BigNumber, pledge: BigNumber) => {
        return total.add(pledge);
      }, constants.Zero);

      return effectiveBPS(
        baseReimbursementBPS,
        minReimbursement,
        maxReimbursement,
        total
      );
    });
  }, [
    isNonAuctionedNoun,
    matchData,
    baseReimbursementBPS,
    minReimbursement,
    maxReimbursement,
  ]);

  if (!matchData) return null;

  const title = `Today's Noun${isNonAuctionedNoun && "s"}`;
  return (
    <div className="px-4">
      {props.asComponent ? (
        <h2 className="text-4xl font-bold text-center">{title}</h2>
      ) : (
        <h1 className="text-5xl font-bold font-serif mb-2 text-center">
          {title}
        </h1>
      )}

      <div className={cx("mx-auto max-w-xl flex flex-col gap-5 my-10")}>
        <NounWithMatches
          nounId={matchData.currentAuctionId}
          pledges={matchData.currentAuctionPledges}
          hideSettle={true}
          reimbursementsBPS={currentAuctionReimbursementsBPS}
        />

        {isNonAuctionedNoun && (
          <NounWithMatches
            nounId={matchData.prevNonAuctionId}
            pledges={matchData.prevNonAuctionPledges}
            hideSettle={true}
            reimbursementsBPS={prevNonAuctionReimbursementsBPS}
          />
        )}
      </div>
    </div>
  );
};

export default Today;
