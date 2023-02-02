import type { NextPage } from "next";
import Recipient from "../../components/about/Recipient";
import useGetRecipientsDescription from "../../hooks/useGetRecipientsDescription";
import { useAppContext } from "../../context/state";
const About: NextPage = () => {
  const recipients = useGetRecipientsDescription(true);
  const baseReimbursementBPS = useAppContext()?.baseReimbursementBPS;
  return (
    <div className="px-4 mx-auto max-w-lg mb-3">
      <h1 className="mb-3 font-serif">About Noun Seek</h1>
      <div className="text-lg mb-3">
        <p className="mb-2">
          NounScout allows anyone to put up a reward for minting a Noun with a
          specific trait and donates the funds to a non-profit.
        </p>
        <p className="mb-2">
          If a Noun with a requested trait is minted, the pledged amount is
          locked and the request cannot be removed.
        </p>
        <p className="mb-2">
          For the duration of Noun auction, others can pledge additional amounts
          to the same or different non-profits. This can be used as opportunity
          to raise awareness for a cause or celebrate the mint.
        </p>
        <p className="mb-2">
          When the auction is over and the next Noun is minted, the reward can
          be sent to the non-profit via a 'settle' transaction to the NounScout
          contract. The user that initiates this settlement will receive up to{" "}
          {baseReimbursementBPS
            ? `${baseReimbursementBPS / 100}%`
            : "a percentage"}{" "}
          of the pledged amount in order to offset gas costs.
        </p>
      </div>
      <div className="text-lg mb-2">
        <h2 className="mt-5 mb-3">Protocol</h2>
        <p>
          The NounScout contract is deployed at{" "}
          <a
            href={
              process.env.NEXT_PUBLIC_CHAIN_NAME === "mainnet"
                ? `https://etherscan.io/address/${process.env.NEXT_PUBLIC_NOUNSEEK_ADDRESS}`
                : `https://goerli.etherscan.io/address/${process.env.NEXT_PUBLIC_NOUNSEEK_ADDRESS}`
            }
            target="_blank"
          >
            {process.env.NEXT_PUBLIC_NOUNSEEK_ADDRESS}
          </a>
          .
        </p>
        <p>
          In-depth protocol documenation can be found on{" "}
          <a
            href="https://github.com/lastpunk9999/noun-seek#nounseek"
            target="_blank"
          >
            Github
          </a>
        </p>
      </div>
      <h2 className="mt-5 mb-3">Supported Non-profits</h2>
      {recipients.map((recipient, i) => {
        return <Recipient recipient={recipient} key={i} />;
      })}
    </div>
  );
};

export default About;
