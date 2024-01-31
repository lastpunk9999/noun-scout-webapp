import { utils, BigNumber } from "ethers";
import { Pledge, BigNumberType } from "../types";
import useGetRecipientDescription from "../hooks/useGetRecipientDescription";
import Image from "next/image";
import cx from "classnames";

type RequestRecipientProps = {
  cardStyle:
    | "detailed"
    | "compact"
    | "settling"
    | "row"
    | "matching"
    | "tweet"
    | undefined;
  pledge?: Pledge;
  reimbursementBPS?: BigNumberType | number;
  donationSent?: boolean;
  lineBreak?: boolean;
  isSettler?: boolean;
};
// .mul(BigNumber.from("10000").sub(effectiveBPS))
//               .div("10000"), //(amount * (1_000_000 - effectiveBPS)) /1_000_000
const RequestRecipient = (props: RequestRecipientProps) => {
  const isDetailed =
    props.cardStyle === "detailed" ||
    props.cardStyle === "matching" ||
    props.cardStyle === "settling";
  const isRow = props.cardStyle === "row";
  const isTweet = props.cardStyle === "tweet";
  const recipientDescription =
    props.pledge?.to !== undefined
      ? useGetRecipientDescription(props.pledge.to)
      : {};
  let amount = "0";
  let amountBN = props.pledge?.amount;
  if (amountBN !== undefined) {
    if (props.reimbursementBPS) {
      amountBN = amountBN
        .mul(BigNumber.from("10000").sub(props.reimbursementBPS))
        .div("10000");
    }
    amount = utils.formatEther(amountBN);
    amount = (Math.round(parseFloat(amount) * 10**4) / 10**4).toString();
  }
  return (
    <li
      className={cx(
        "flex justify-start items-center gap-3 leading-none",
        props.cardStyle === "detailed" ||
          props.cardStyle === "settling" ||
          props.cardStyle === "matching"
          ? "!justify-start"
          : ""
      )}
    >
      <div
        className={cx(
          props.isSettler && "hidden",
          isDetailed
            ? "w-[40px]"
            : isRow
            ? "w-12"
            : isTweet
            ? "w-[50px]"
            : "w-[30px]",
          !recipientDescription?.image &&
            !props.isSettler &&
            "bg-slate-200 rounded-md",
          !recipientDescription?.image &&
            !props.isSettler &&
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
        <p
          className={cx(
            props.isSettler && "text-sm  border-t-2 p-2 pb-0",
            "inline-block leading-5 grow"
          )}
        >
          <span
            className={cx(
              amount &&
                amount !== "0" &&
                !props.isSettler &&
                "bg-slate-200 font-bold whitespace-nowrap px-2",
              ""
            )}
          >
            {amount && amount !== "0" ? amount : ""} ETH
            {amount && amount !== "0" ? "" : " "}
          </span>

          <>
            {props.isSettler
              ? null
              : !props.donationSent
              ? "will be sent to"
              : "was sent to"}
            {recipientDescription.name && props.lineBreak ? <br /> : " "}
            <span
              className={cx(
                recipientDescription.name &&
                  "bg-slate-200  px-2 sm:whitespace-nowrap ",
                " "
              )}
            >
              {recipientDescription.name ? (
                recipientDescription.name
              ) : props.isSettler ? (
                <>will reimburse settlement gas fees</>
              ) : (
                "a good cause"
              )}
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
      {isTweet && (
        <p className={cx("inline-block leading-5 grow")}>
          I'm sending
          <span
            className={cx("ml-1 bg-slate-200 font-bold whitespace-nowrap px-2")}
          >
            {amount} ETH
          </span>
          <>
            {recipientDescription.name && props.lineBreak ? <br /> : " "}
            to
            <span
              className={cx(
                recipientDescription.name &&
                  "bg-slate-200 ml-1 px-2 font-bold whitespace-nowrap ",
                " "
              )}
            >
              {recipientDescription.name}
            </span>
          </>
        </p>
      )}
    </li>
  );
};

export default RequestRecipient;
