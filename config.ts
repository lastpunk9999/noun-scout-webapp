import nounSeekABI from "./abi/nounSeekABI";
import AuctionHouseABI from "./abi/nounsAuctionHouseABI.json";

export const nounSeekContract = {
  address: process.env.NEXT_PUBLIC_NOUNSEEK_ADDRESS,
  abi: nounSeekABI,
};

export const nounsAuctionHouseContract = {
  address: process.env.NEXT_PUBLIC_NOUNS_AUCTION_HOUSE_ADDRESS,
  abi: AuctionHouseABI,
};
