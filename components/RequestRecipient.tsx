import { utils, BigNumber } from "ethers";
import { Pledge, BigNumberType } from "../types";
import useGetRecipientDescription from "../hooks/useGetRecipientDescription";
import Image from "next/image";
import cx from "classNames";
type RequestRecipientProps = {
  cardStyle: "detailed" | "compact" | "matching" | undefined;
  pledge: Pledge;
  reimbursementBPS?: BigNumberType;
  donationSent?: boolean;
};
// .mul(BigNumber.from("10000").sub(effectiveBPS))
//               .div("10000"), //(amount * (1_000_000 - effectiveBPS)) /1_000_000
const RequestRecipient = (props: RequestRecipientProps) => {
  const isDetailed =
    props.cardStyle === "detailed" || props.cardStyle === "matching";
  const isRow = props.cardStyle === "row";
  const recipientDescription =
    props.pledge?.to !== undefined
      ? useGetRecipientDescription(props.pledge.to)
      : {};
  let amount = props.pledge?.amount;
  if (amount !== undefined) {
    if (props.cardStyle === "matching" && props.reimbursementBPS) {
      amount = amount
        .mul(BigNumber.from("10000").sub(props.reimbursementBPS))
        .div("10000");
    }
    amount = utils.formatEther(amount);
  }
  return (
    <li
      className={cx(
        "flex justify-start items-center gap-3 leading-none",
        props.cardStyle === "detailed" ||
          (props.cardStyle === "matching" && "!justify-start")
      )}
    >
      <div
        className={cx(
          isDetailed ? "w-[40px]" : isRow ? "w-12" : "w-[30px]",
          !recipientDescription?.image && "bg-slate-200 rounded-md",
          !recipientDescription?.image &&
            (isDetailed ? "pb-[40px]" : "pb-[30px]")
        )}
      >
        {recipientDescription.image && (
          <Image
            src={recipientDescription.image}
            width={320}
            height={320}
            alt={`${recipientDescription.name} logo`}
            className="w-full aspect-square rounded-md inline-block"
          />
        )}
      </div>

      {isDetailed && (
        <p className="inline-block leading-5 grow">
          {amount !== undefined && (
            <span className="bg-slate-200 font-bold whitespace-nowrap px-2">
              {amount} ETH
            </span>
          )}
          {recipientDescription.name && (
            <>
              {!props.donationSent ? "will be" : "was"} sent to
              {recipientDescription.name && props.lineBreak ? <br /> : " "}
              <span className="bg-slate-200 font-bold whitespace-nowrap px-2">
                {recipientDescription.name ?? "_______"}
              </span>
            </>
          )}
        </p>
      )}
      {!isDetailed && !isRow && props.donationSent && (
        <span className="bg-slate-200 font-bold whitespace-nowrap">
          {recipientDescription.name}
        </span>
      )}
      {isRow && (
        <p className="inline-block leading-5 grow">
          <span className="whitespace-nowrap">{recipientDescription.name}</span>
        </p>
      )}
    </li>
  );
};

export default RequestRecipient;
