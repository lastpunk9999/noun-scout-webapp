import nounSeekABI from "./abi/nounSeekABI";
import nounsAuctionHouseABI from "./abi/nounsAuctionHouseABI";
import nounsTokenABI from "./abi/nounsTokenABI";

export const nounSeekContract = {
  address: process.env.NEXT_PUBLIC_NOUNSEEK_ADDRESS,
  abi: nounSeekABI,
};

export const nounsAuctionHouseContract = {
  address: process.env.NEXT_PUBLIC_NOUNS_AUCTION_HOUSE_ADDRESS,
  abi: nounsAuctionHouseABI,
};

export const nounsTokenContract = {
  address: process.env.NEXT_PUBLIC_NOUNS_TOKEN_ADDRESS,
  abi: nounsTokenABI,
};

export const siteTitle = "Noun Seek";
export const siteDescription = "Sponsor Nouns. Send money to charity.";
export const siteUrl = "";