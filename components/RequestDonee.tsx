import { utils } from "ethers";
import { Donation } from "../types";
import useGetDoneeDescription from "../hooks/useGetDoneeDescription";
import cx from "classNames";
type RequestDoneeProps = {
  cardStyle: "detailed" | "compact" | undefined;
  donation: Donation;
};

const RequestDonee = (props: RequestDoneeProps) => {
  const doneeDescription = useGetDoneeDescription(props.donation.to);
  return (
    <li
      className={cx(
        "flex justify-center items-center gap-3",
        props.cardStyle === "detailed" && "!justify-start"
      )}
    >
      <div
        className={cx(props.cardStyle === "detailed" ? "w-[40px]" : "w-[30px]")}
      >
        <img
          src={doneeDescription.image}
          alt={`${doneeDescription.title} logo`}
          className="w-full aspect-square rounded-full"
        />
      </div>
      {props.cardStyle === "detailed" && (
        <div className="">
          <p className="text-lg font-bold leading-none">
            {doneeDescription.title}
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
