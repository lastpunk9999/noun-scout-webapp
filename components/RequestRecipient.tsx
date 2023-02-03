import { utils, BigNumber } from "ethers";
import { Pledge, BigNumberType } from "../types";
import useGetRecipientDescription from "../hooks/useGetRecipientDescription";
import Image from "next/image";
import cx from "classnames";

type RequestRecipientProps = {
  cardStyle: "detailed" | "compact" | "matching" | "row" | undefined;
  pledge: Pledge;
  reimbursementBPS?: BigNumberType;
  donationSent?: boolean;
  calculateDonation?: boolean;
  lineBreak?: boolean;
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
  let amount = "0";
  let amountBN = props.pledge?.amount;
  if (amountBN !== undefined) {
    if (
      (props.cardStyle === "matching" || props.calculateDonation) &&
      props.reimbursementBPS
    ) {
      amountBN = amountBN
        .mul(BigNumber.from("10000").sub(props.reimbursementBPS))
        .div("10000");
    }
    amount = utils.formatEther(amountBN);
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
          <span
            className={cx(
              amount &&
                amount !== "0" &&
                "bg-slate-200 font-bold whitespace-nowrap px-2",
              ""
            )}
          >
            {amount && amount !== "0" ? amount : ""} ETH
            {amount && amount !== "0" ? "" : " "}
          </span>

          <>
            {!props.donationSent ? "will be" : "was"} sent to
            {recipientDescription.name && props.lineBreak ? <br /> : " "}
            <span
              className={cx(
                recipientDescription.name &&
                  "bg-slate-200  px-2 whitespace-nowrap ",
                " "
              )}
            >
              {recipientDescription.name ?? "a non-profit"}
            </span>
          </>
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
