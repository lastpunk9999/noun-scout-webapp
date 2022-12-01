import { utils } from "ethers";
import { Donation } from "../types";
import useGetDoneeDescription from "../hooks/useGetDoneeDescription";
import cx from "classNames";
type RequestDoneeProps = {
  donation: Donation;
  style: string;
};

const RequestDonee = (props: RequestDoneeProps) => {
  console.log("props.donation", props.donation);
  const doneeDescription = useGetDoneeDescription(props.donation.to);
  return (
    <li className="flex justify-center items-center gap-3">
      <div className={cx(props.style === "full" ? "w-[40px]" : "w-[30px]")}>
        <img
          src={doneeDescription.image}
          alt={`${doneeDescription.title} logo`}
          className="w-full aspect-square rounded-full"
        />
      </div>
      {props.style === "full" && (
        <div className="">
          <p className="text-lg font-bold leading-none">
            {doneeDescription.title}
          </p>
          {/* <p className="text-md text-slate-500 leading-none">
            {utils.formatEther(props.donation.amount)} ETH
          </p> */}
        </div>
      )}
    </li>
  );
};

export default RequestDonee;
