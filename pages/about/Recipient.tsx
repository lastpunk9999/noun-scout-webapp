import cx from "classnames";
import { Request, Recipient } from "../../types";
import Image from "next/image";

type RecipientProps = {
  recipient: Recipient;
};

const Recipient = (props: RecipientProps) => {
  return (
    <div
      className={cx(
        "group bg-white shadow-md flex flex-col gap-5 h-full text-left p-3 mb-3 border border-transparent  hover:shadow-lg transition-shadow relative"
      )}
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
        {props.recipient.description && <p>{props.recipient.description}</p>}
      </div>
    </div>
  );
};

export default Recipient;
