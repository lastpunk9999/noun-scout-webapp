import type { NextPage } from "next";
import Recipient from "../../components/about/Recipient";
import useGetRecipientsDescription from "../../hooks/useGetRecipientsDescription";
import { useAppContext } from "../../context/state";
import NounChatBubble from "../../components/NounChatBubble";
const About: NextPage = () => {
  const recipients = useGetRecipientsDescription(true);
  const baseReimbursementBPS = useAppContext()?.baseReimbursementBPS;
  return (
    <div className="px-4 mx-auto max-w-lg mb-3">
      <h1 className="mb-3 font-serif">About Noun Scout</h1>
      <div className="text-lg mb-8">
        <p className="mb-2">
          Noun Scout allows anyone to put up a reward for minting a Noun with a
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
          be sent to the non-profit via a 'settle' transaction to the Noun Scout
          contract. The user that initiates this settlement will receive up to{" "}
          {baseReimbursementBPS
            ? `${baseReimbursementBPS / 100}%`
            : "a percentage"}{" "}
          of the pledged amount in order to offset gas costs.
        </p>
      </div>
      <div className="text-lg mb-8">
        <h2 className="mt-5 mb-3">Contract</h2>
        <p>
          The Noun Scout contract is deployed at{" "}
          <a
            href={
              process.env.NEXT_PUBLIC_CHAIN_NAME === "mainnet"
                ? `https://etherscan.io/address/${process.env.NEXT_PUBLIC_NOUNSCOUT_ADDRESS}`
                : `https://goerli.etherscan.io/address/${process.env.NEXT_PUBLIC_NOUNSCOUT_ADDRESS}`
            }
            target="_blank"
          >
            nounscout.eth
          </a>
          .
        </p>
        <p>
          In-depth protocol documenation can be found on{" "}
          <a
            href="https://github.com/lastpunk9999/noun-scout-contract#nounscout"
            target="_blank"
          >
            Github
          </a>
        </p>
      </div>
      <div className="text-lg mb-8">
        <h2 className="mt-5 mb-3">Credits</h2>
        <NounChatBubble size="large" className="mb-2" info={true}>
          🙏 Funded by{" "}
          <a href="https://prop.house/nouns/open-round:-25-eth" target="_blank">
            Prop House
          </a>
        </NounChatBubble>

        <NounChatBubble size="large" className="mb-2" info={true}>
          Protocol by{" "}
          <a href="https://twitter.com/lastpunk9999" target="_blank">
            9999
          </a>
        </NounChatBubble>
        <NounChatBubble size="large" className="mb-2" info={true}>
          🤯 Site designed and developed with{" "}
          <a href="https://twitter.com/ripe0x" target="_blank">
            ripe
          </a>
        </NounChatBubble>
        <NounChatBubble size="large" className="mb-2" info={true}>
          🐸 App named by{" "}
          <a href="https://twitter.com/toady_hawk" target="_blank">
            Toady Hawk
          </a>
        </NounChatBubble>
        <NounChatBubble size="large" className="mb-2" info={true}>
          🖥 Logo by{" "}
          <a href="https://twitter.com/mrbriandesign" target="_blank">
            mrbriandesign
          </a>
        </NounChatBubble>
      </div>
      <h2 className="mt-5 mb-3">Supported Non-profits</h2>
      {recipients.map((recipient, i) => {
        return <Recipient recipient={recipient} key={i} />;
      })}
    </div>
  );
};

export default About;
