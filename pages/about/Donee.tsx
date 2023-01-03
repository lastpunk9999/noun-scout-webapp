import cx from "classnames";
import { Request, Donee } from "../../types";
import Image from "next/image";

type DoneeProps = {
  donee: Donee;
};

const Donee = (props: DoneeProps) => {
  return (
    <div
      className={cx(
        "group bg-white shadow-md flex flex-col gap-5 h-full text-left p-3 mb-3 border border-transparent  hover:shadow-lg transition-shadow relative"
      )}
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
    </div>
  );
};

export default Donee;
