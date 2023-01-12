import { utils } from "ethers";
import { Donation } from "../types";
import useGetDoneeDescription from "../hooks/useGetDoneeDescription";
import Image from "next/image";
import cx from "classNames";
type RequestDoneeProps = {
  cardStyle: "detailed" | "compact" | "matching" | undefined;
  donation: Donation;
};

const RequestDonee = (props: RequestDoneeProps) => {
  const isDetailed =
    props.cardStyle === "detailed" || props.cardStyle === "matching";
  const doneeDescription =
    props.donation?.to !== undefined
      ? useGetDoneeDescription(props.donation.to)
      : {};
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
          isDetailed ? "w-[40px]" : "w-[30px]",
          !doneeDescription?.image && "bg-slate-200 rounded-md",
          !doneeDescription?.image && (isDetailed ? "pb-[40px]" : "pb-[30px]")
        )}
      >
        {doneeDescription.image && (
          <Image
            src={doneeDescription.image}
            width={320}
            height={320}
            alt={`${doneeDescription.name} logo`}
            className="w-full aspect-square rounded-md inline-block"
          />
        )}
      </div>

      {isDetailed && (
        <p className="inline-block leading-5 grow">
          <span className="bg-slate-200 font-bold whitespace-nowrap px-2">
            {props.donation?.amount
              ? utils.formatEther(props.donation.amount)
              : "_______"}{" "}
            ETH
          </span>{" "}
          will be sent to
          {doneeDescription.name && props.lineBreak ? <br /> : " "}
          <span className="bg-slate-200 font-bold whitespace-nowrap px-2">
            {doneeDescription.name ?? "_______"}
          </span>
        </p>
      )}
    </li>
  );
};

export default RequestDonee;
