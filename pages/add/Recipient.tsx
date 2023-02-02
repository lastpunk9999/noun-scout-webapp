import cx from "classnames";
import { Request, Recipient } from "../../types";
import Image from "next/image";

type RecipientProps = {
  recipient: Recipient;
  requestSeed: Request;
  setRequestSeed: Function;
};

const Recipient = (props: RecipientProps) => {
  return (
    <button
      className={cx(
        "group bg-white shadow-md flex flex-col gap-5 h-full text-left p-3 border border-transparent rounded-lg hover:shadow-lg transition-shadow relative",
        // " text-left border border-transparent rounded-lg hover:shadow-md transition-shadow relative",
        props.requestSeed?.pledge?.to === props.recipient.id &&
          "bg-white !shadow-lg !border-1 !border-blue-500 opacity-100",
        props.requestSeed?.pledge?.to >= 0 &&
          props.requestSeed?.pledge?.to !== props.recipient.id
          ? "opacity-50 hover:opacity-80"
          : ""
      )}
      onClick={() =>
        props.requestSeed?.pledge?.to === props.recipient.id
          ? props.setRequestSeed((request) => ({
              trait: request.trait,
              pledge: {
                to: undefined,
                amount: props.requestSeed?.pledge?.amount,
              },
            }))
          : props.setRequestSeed((request) => ({
              trait: request.trait,
              pledge: {
                to: props.recipient.id,
                amount: props.requestSeed?.pledge?.amount,
              },
            }))
      }
    >
      <div className="w-20 rounded">
        <Image
          src={props.recipient.image}
          alt={`${props.recipient.name} logo`}
          layout="responsive"
          width={320}
          height={320}
          className="rounded-md"
        />
      </div>

      <div>
        {props.recipient.name && (
          <h4 className="text-lg font-bold">{props.recipient.name}</h4>
        )}
        {props.recipient.description && (
          <p>
            {props.recipient.description}
            {props.recipient.website && (
              <>
                <br />
                <a href={props.recipient.website} target="_blank">
                  {props.recipient.website}
                </a>
              </>
            )}
          </p>
        )}
      </div>

      <div
        className={cx(
          "absolute top-0 right-1 hidden group-hover:block",
          props.requestSeed?.pledge?.to === props.recipient.id && "!block"
        )}
      >
        <input
          type="checkbox"
          readOnly
          checked={
            props.requestSeed?.pledge?.to === props.recipient.id ? true : false
          }
        />
      </div>
    </button>
  );
};

export default Recipient;
