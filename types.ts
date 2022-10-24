export interface Request {
  trait: number;
  traitId: number;
  nounId: number;
  doneeId: number;
  amount: BigNumber;
}

export interface DonationsForNextNoun {
  nextAuctionedId: number;
  nextNonAuctionedId: number;
  nextAuctionDonations: Array;
  nextNonAuctionDonations: Array;
}

export interface Donee {
  name: string;
}

export interface NounSeed {
  background: number;
  body: number;
  accessory: number;
  head: number;
  glasses: number;
}

export interface NounSeedAndImageData {
  src: string;
  seed?: NounSeed;
  isNounLoading: boolean;
}
