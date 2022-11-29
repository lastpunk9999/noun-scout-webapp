import { BigNumber as BN } from "@ethersproject/bignumber";
export type BigNumber = BN;
export type SingularTraitName =
  | "background"
  | "body"
  | "accessory"
  | "head"
  | "glasses";

export type PluralTraitName =
  | "backgrounds"
  | "bodoes"
  | "accessories"
  | "heads"
  | "glasses";

export enum RequestStatus {
  CAN_REMOVE, // 0
  REMOVED, // 1
  DONATION_SENT, // 2
  AUCTION_ENDING_SOON, // 3
  MATCH_FOUND, // 4
}

export interface Request {
  id: number;
  nounId: number;
  status: RequestStatus;
  trait: TraitNameAndImageData;
  donation: Donation;
}

export interface DonationsForUpcomingNoun {
  nextAuctionedId: number;
  nextNonAuctionedId: number;
  nextAuctionDonations: [
    BigNumber[],
    BigNumber[],
    BigNumber[],
    BigNumber[],
    BigNumber[]
  ];
  nextNonAuctionDonations: [
    BigNumber[],
    BigNumber[],
    BigNumber[],
    BigNumber[],
    BigNumber[]
  ];
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

export interface Donation {
  to: number;
  amount: BigNumber;
}

export interface TraitAndDonations {
  trait: TraitNameAndImageData;
  donations: Donation[];
}

export type DonationsByTrait = Record<number, TraitAndDonations>;

export type DonationsByTraitType = Record<PluralTraitName, DonationsByTrait>;

export interface ImageData {
  filename: string;
  data: string;
}

export interface TraitNameAndImageData {
  name: string;
  traitId: number;
  traitTypeId: number;
  type: SingularTraitName;
  imageData: ImageData;
}
