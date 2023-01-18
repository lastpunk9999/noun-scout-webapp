import { Request } from "../../types";
import { useAppContext } from "../../context/state";
import Recipient from "./Recipient";
import useGetRecipientsDescription from "../../hooks/useGetRecipientDescription";

type AddOrgsProps = {
  setRequestSeed: Function;
  requestSeed: Request;
};

const AddOrgs = (props: AddOrgsProps) => {
  const recipients = useGetRecipientsDescription(true);

  return (
    <div className="flex flex-col gap-10 relative">
      <div className="prose">
        <h3 className="text-lg font-bold mb-2 text-slate-500">
          About these charities
        </h3>
        <p>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget
          lacinia odio sem nec elit. Maecenas sed diam eget risus varius blandit
          sit amet non magna. Aenean eu leo quam. Pellentesque ornare sem
          lacinia quam venenatis vestibulum.
        </p>
      </div>
      <div className="">
        <div>
          <h3 className="text-xl font-bold mb-2">Select a charity</h3>
          <div className="grid gap-5 items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {recipients.map((recipient, i) => {
              return (
                <Recipient
                  recipient={recipient}
                  key={i}
                  requestSeed={props.requestSeed}
                  setRequestSeed={props.setRequestSeed}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOrgs;
