import cx from "classnames";
import { Request } from "../../types";
import useGetDoneeDescription from "../../hooks/useGetDoneeDescription";
import Image from "next/image";

type DoneeProps = {
  doneeId: number;
  requestSeed: Request;
  setRequestSeed: Function;
};

const Donee = (props: DoneeProps) => {
  const doneeDescription = useGetDoneeDescription(props.doneeId);
  return (
    <button
      className={cx(
        "group bg-white shadow-md flex flex-col gap-5 h-full text-left p-3 border border-transparent rounded-lg hover:shadow-lg transition-shadow relative",
        // " text-left border border-transparent rounded-lg hover:shadow-md transition-shadow relative",
        props.requestSeed?.donation?.to === props.doneeId &&
          "bg-white !shadow-lg !border-1 !border-blue-500 opacity-100",
        props.requestSeed?.donation?.to >= 0 &&
          props.requestSeed?.donation?.to !== props.doneeId
          ? "opacity-50 hover:opacity-80"
          : ""
      )}
      onClick={() =>
        props.requestSeed?.donation?.to === props.doneeId
          ? props.setRequestSeed((request) => ({
              trait: request.trait,
              donation: {
                to: undefined,
                amount: props.requestSeed?.donation?.amount,
              },
            }))
          : props.setRequestSeed((request) => ({
              trait: request.trait,
              donation: {
                to: props.doneeId,
                amount: props.requestSeed?.donation?.amount,
              },
            }))
      }
    >
      <div className="w-20 rounded">
        <Image
          src={
            doneeDescription.image
              ? doneeDescription.image
              : "/donees/placeholder.svg"
          }
          alt={`${doneeDescription.name} logo`}
          layout="responsive"
          width={320}
          height={320}
          className="rounded-md"
        />
      </div>

      <div>
        {doneeDescription.name && (
          <h4 className="text-lg font-bold">{doneeDescription.name}</h4>
        )}
        {doneeDescription.description && <p>{doneeDescription.description}</p>}
      </div>

      <div
        className={cx(
          "absolute top-0 right-1 hidden group-hover:block",
          props.requestSeed?.donation?.to === props.doneeId && "!block"
        )}
      >
        <input
          type="checkbox"
          readOnly
          checked={
            props.requestSeed?.donation?.to === props.doneeId ? true : false
          }
        />
      </div>
    </button>
  );
};

export default Donee;
