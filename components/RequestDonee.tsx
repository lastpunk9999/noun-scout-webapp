import { utils } from "ethers";
import { Donation } from "../types";
import useGetDoneeDescription from "../hooks/useGetDoneeDescription";

type RequestDoneeProps = {
  donation: Donation;
}

const RequestDonee = (props: RequestDoneeProps) => {
  console.log('props.donation', props.donation);
  const doneeDescription = useGetDoneeDescription(props.donation.to);
  return (
    <li className="flex justify-center items-center gap-2">
      <div className="w-[42px]">
        <img src={doneeDescription.image} alt={`${doneeDescription.title} logo`} className="w-full aspect-square rounded-full" />
      </div>
      <div className="">
        <p className="text-sm font-bold leading-none">
          {doneeDescription.title}
        </p>
        <p className="text-slate-500 text-sm leading-none">
          {utils.formatEther(props.donation.amount)} ETH
        </p>
      </div>
    </li>
  );
}

export default RequestDonee;