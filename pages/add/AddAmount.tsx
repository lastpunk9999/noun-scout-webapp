import { useEffect, useState, useMemo } from "react";
import { BigNumber, ethers, utils, constants } from "ethers";
import { BigNumberType, Request } from "../../types";
import { useAppContext } from "../../context/state";
import cx from "classnames";
import NounChatBubble, { nounProfiles } from "../../components/NounChatBubble";

type AddAmountProps = {
  setRequestSeed: Function;
  requestSeed: Request;
};

const decimals = process.env.NEXT_PUBLIC_CHAIN_NAME === "mainnet" ? 3 : 5;

const AddAmount = (props: AddAmountProps) => {
  const {
    baseReimbursementBPS,
    minValue = BigNumber.from("1").div("10"),
    pledgesForUpcomingNoun,
  } = useAppContext() ?? {};

  const [amount, setAmount] = useState<string>(
    utils.formatEther(props.requestSeed?.pledge?.amount ?? minValue)
  );

  const amountInWei = useMemo(() => utils.parseEther(amount || "0"), [amount]);

  const belowMinValue = useMemo(
    () => amountInWei.lt(minValue),
    [amountInWei, minValue]
  );

  useEffect(() => {
    props.setRequestSeed((request) => ({
      trait: request.trait,
      pledge: {
        to: props.requestSeed?.pledge?.to || undefined,
        amount: belowMinValue ? undefined : amountInWei,
      },
    }));
  }, [amountInWei, belowMinValue]);

  const [topPledge, totalPledgeCount, averagePledge] = useMemo(() => {
    const totalPledges = (
      pledgesForUpcomingNoun?.nextAuctionPledges ?? [constants.Zero]
    )
      .flat(Infinity)
      .filter((p) => !p.isZero())
      .sort((a, b) => (a.lt(b) ? 1 : -1));
    const averagePledge = totalPledges
      .reduce((sum, p) => sum.add(p))
      .div(totalPledges.length);
    return [totalPledges[0], totalPledges.length, averagePledge];
  }, [pledgesForUpcomingNoun?.nextAuctionPledges]);

  const handleAmountInput = (event: ChangeEvent<HTMLInputElement>) => {
    let input = event.target.value.replace(/\s*/, "");
    if (input === "") input = undefined;
    // disable more than 2 digits after decimal point
    if (input?.includes(".") && input.split(".")[1].length > decimals) {
      return;
    }

    setAmount(input);
  };
  const message = "";
  const nounProfile = nounProfiles[0];
  if (amountInWei.eq(minValue))
    message = (
      <>
        You're pledging the minimum amount. <br />
        FYI the average pledge is {utils.formatEther(averagePledge)} ETH
      </>
    );
  if (amountInWei.gt(minValue) && amountInWei.lt(averagePledge))
    message = (
      <>
        Your pledge is below the average of {utils.formatEther(averagePledge)}{" "}
        ETH
      </>
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

  if (amountInWei.eq(topPledge)) message = "You're tied for top pledge!";

  if (amountInWei.gt(topPledge)) message = "You're top pledge!";

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
          will be sent to your non-profit.{" "}
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
