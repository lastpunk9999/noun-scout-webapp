import cx from "classnames";
import { Request, Donee } from "../../types";
import Image from "next/image";

type DoneeProps = {
  donee: Donee;
  requestSeed: Request;
  setRequestSeed: Function;
};

const Donee = (props: DoneeProps) => {
  return (
    <button
      className={cx(
        "group bg-white shadow-md flex flex-col gap-5 h-full text-left p-3 border border-transparent rounded-lg hover:shadow-lg transition-shadow relative",
        // " text-left border border-transparent rounded-lg hover:shadow-md transition-shadow relative",
        props.requestSeed?.donation?.to === props.donee.id &&
          "bg-white !shadow-lg !border-1 !border-blue-500 opacity-100",
        props.requestSeed?.donation?.to >= 0 &&
          props.requestSeed?.donation?.to !== props.donee.id
          ? "opacity-50 hover:opacity-80"
          : ""
      )}
      onClick={() =>
        props.requestSeed?.donation?.to === props.donee.id
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
                to: props.donee.id,
                amount: props.requestSeed?.donation?.amount,
              },
            }))
      }
    >
      <div className="w-20 rounded">
        <Image
          src={props.donee.image}
          alt={`${props.donee.name} logo`}
          layout="responsive"
          width={320}
          height={320}
          className="rounded-md"
        />
      </div>

      <div>
        {props.donee.name && (
          <h4 className="text-lg font-bold">{props.donee.name}</h4>
        )}
        {props.donee.description && <p>{props.donee.description}</p>}
      </div>

      <div
        className={cx(
          "absolute top-0 right-1 hidden group-hover:block",
          props.requestSeed?.donation?.to === props.donee.id && "!block"
        )}
      >
        <input
          type="checkbox"
          readOnly
          checked={
            props.requestSeed?.donation?.to === props.donee.id ? true : false
          }
        />
      </div>
    </button>
  );
};

export default Donee;
