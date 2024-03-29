import { useEffect, useState, useMemo } from "react";
import { BigNumber, ethers, utils, constants } from "ethers";
import { BigNumberType, Request } from "../../types";
import { useAppContext } from "../../context/state";
import cx from "classnames";
import NounChatBubble, { nounProfiles } from "../NounChatBubble";

type AddAmountProps = {
  setRequestSeed: Function;
  requestSeed: Request;
};

const decimals = process.env.NEXT_PUBLIC_CHAIN_NAME === "mainnet" ? 3 : 5;

const AddAmount = (props: AddAmountProps) => {
  const {
    baseReimbursementBPS,
    minValue = utils.parseEther("0.01"),
    pledgesForUpcomingNoun,
  } = useAppContext() ?? {};

  const [amount, setAmount] = useState<string>(
    utils.formatEther(props.requestSeed?.pledge?.amount ?? minValue)
  );

  const amountInWei = useMemo(() => utils.parseEther(amount), [amount]);

  const belowMinValue = useMemo(
    () => amountInWei.lt(minValue),
    [amountInWei, minValue]
  );

  useEffect(() => {
    props.setRequestSeed({
      pledge: {
        to: props.requestSeed?.pledge?.to || undefined,
        amount: belowMinValue ? undefined : amountInWei,
      },
    });
  }, [amountInWei, belowMinValue]);

  const [topPledge, totalPledgeCount, averagePledge] = useMemo(() => {
    if (!pledgesForUpcomingNoun?.nextAuctionPledges)
      return [constants.Zero, 0, constants.Zero];
    const totalPledges = pledgesForUpcomingNoun?.nextAuctionPledges
      .flat(Infinity)
      .filter((p) => !p.isZero())
      .sort((a, b) => (a.lt(b) ? 1 : -1));

    if (totalPledges.length === 0) return [constants.Zero, 0, constants.Zero];
    const averagePledge = totalPledges
      .reduce((sum, p) => sum.add(p))
      .div(totalPledges.length);

    return [totalPledges[0], totalPledges.length, averagePledge];
  }, [pledgesForUpcomingNoun?.nextAuctionPledges]);

  const handleAmountInput = (event) => {
    let input = event.target.value.replace(/\s*/, "");
    if (input === "") input = undefined;
    // disable more than 2 digits after decimal point
    if (input?.includes(".") && input.split(".")[1].length > decimals) {
      return;
    }

    setAmount(input ?? "0");
  };
  let message = <></>;
  const nounProfile = nounProfiles[0];
  const avergedPledgeRounded =
    Math.round(Number(utils.formatEther(averagePledge)) * 100000) / 100000;
  if (amountInWei.eq(minValue))
    message = (
      <>
        You're pledging the minimum amount. <br />
        FYI the average pledge is {avergedPledgeRounded} ETH
      </>
    );
  if (amountInWei.gt(minValue) && amountInWei.lt(averagePledge))
    message = (
      <>Your pledge is below the average of {avergedPledgeRounded} ETH</>
    );
  if (amountInWei.gt(minValue) && amountInWei.eq(averagePledge))
    message = (
      <>
        You're pledging the average amount. <br />
        FYI the top pledge is {utils.formatEther(topPledge)} ETH
      </>
    );

  if (amountInWei.gt(averagePledge) && amountInWei.lt(topPledge))
    message = <>FYI the top pledge is {utils.formatEther(topPledge)} ETH</>;

  if (amountInWei.eq(topPledge)) message = <>You're tied for top pledge!</>;

  if (amountInWei.gt(topPledge)) message = <>You've got the top pledge!</>;

  if (belowMinValue)
    message = <>Minimum is {utils.formatEther(minValue)} ETH</>;

  return (
    <div className="min-h-[50vh]">
      <div className="flex flex-col  gap-5 relative">
        <NounChatBubble error={belowMinValue} {...nounProfile}>
          {message}
        </NounChatBubble>
        <div className="relative sm:w-[10rem]">
          <div className="relative">
            <span
              className={cx(
                "text-lg pt-2 absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none",
                !belowMinValue && "text-gray-400"
              )}
            >
              Ξ
            </span>
            <input
              className={cx(
                "text-lg shadow appearance-none border rounded w-full py-2 pl-7 px-3  leading-tight focus:outline-none focus:shadow-outline mt-2",
                belowMinValue
                  ? "bg-red-50 border border-red-500 text-red-900"
                  : "text-gray-700"
              )}
              type="number"
              placeholder={utils.formatEther(minValue)}
              min={utils.formatEther(minValue)}
              value={amount}
              onChange={handleAmountInput}
              step="0.01"
            />
          </div>
        </div>
      </div>
      <div>
        <p className="text-sm italic opacity-80 pt-3">
          Note:{" "}
          {baseReimbursementBPS
            ? `${100 - baseReimbursementBPS / 100}%`
            : "Most"}{" "}
          will be sent to your cause.{" "}
          {baseReimbursementBPS
            ? `${baseReimbursementBPS / 100}%`
            : "a percentage"}{" "}
          will pay a user to settle this request on-chain.
        </p>
      </div>
    </div>
  );
};

export default AddAmount;
