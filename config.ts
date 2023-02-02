import nounScoutABI from "./abi/nounScoutABI";
import nounsAuctionHouseABI from "./abi/nounsAuctionHouseABI";
import nounsTokenABI from "./abi/nounsTokenABI";

export const nounScoutContract = {
  address: process.env.NEXT_PUBLIC_NOUNSEEK_ADDRESS,
  abi: nounScoutABI,
};

export const nounsAuctionHouseContract = {
  address: process.env.NEXT_PUBLIC_NOUNS_AUCTION_HOUSE_ADDRESS,
  abi: nounsAuctionHouseABI,
};

export const nounsTokenContract = {
  address: process.env.NEXT_PUBLIC_NOUNS_TOKEN_ADDRESS,
  abi: nounsTokenABI,
};

export const siteTitle = "NounScout";
export const siteDescription = `Mint your favorite Noun trait (and do some good at the same time)`;
export const siteUrl = "";
