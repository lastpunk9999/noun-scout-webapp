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
  const doneeDescription = useGetDoneeDescription(props.donation.to);
  console.log("doneeDescription", doneeDescription);
  return (
    <li
      className={cx(
        "flex justify-start items-center gap-3",
        props.cardStyle === "detailed" ||
          (props.cardStyle === "matching" && "!justify-start")
      )}
    >
      <div
        className={cx(
          props.cardStyle === "detailed" || props.cardStyle === "matching"
            ? "w-[40px]"
            : "w-[30px]"
        )}
      >
        <Image
          src={
            doneeDescription.image
              ? doneeDescription.image
              : "/donees/placeholder.svg"
          }
          width={320}
          height={320}
          alt={`${doneeDescription.title} logo`}
          className="w-full aspect-square rounded-md"
        />
      </div>
      {(props.cardStyle === "detailed" || props.cardStyle === "matching") && (
        <div>
          <p className="text-lg font-bold leading-none">
            {doneeDescription.name}
          </p>
          <p className="text-md text-slate-500 leading-none">
            {utils.formatEther(props.donation.amount)} ETH
          </p>
        </div>
      )}
    </li>
  );
};

export default RequestDonee;
