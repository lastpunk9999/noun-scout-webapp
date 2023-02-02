import { BigNumber as BN } from "@ethersproject/bignumber";
export type BigNumber = BN;
export type BigNumberType = BN;
export type SingularTraitName =
  | "background"
  | "body"
  | "accessory"
  | "head"
  | "glasses";

export type PluralTraitName =
  | "backgrounds"
  | "bodies"
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
  pledge: Pledge;
}

export interface PledgesForUpcomingNoun {
  nextAuctionedId: number;
  nextNonAuctionedId: number;
  nextAuctionPledges: [
    BigNumber[],
    BigNumber[],
    BigNumber[],
    BigNumber[],
    BigNumber[]
  ];
  nextNonAuctionPledges: [
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

export interface Pledge {
  to: number;
  amount: BigNumber;
}

export interface TraitAndPledges {
  trait: TraitNameAndImageData;
  pledges: Pledge[];
  total: BigNumber;
}

export type PledgesByTrait = Record<number, TraitAndPledges>;

export type PledgesByTraitType = Record<PluralTraitName, PledgesByTrait>;

export interface ImageData {
  filename: string;
  data: string;
}

export interface TraitNameAndImageData {
  name: string;
  traitId: number;
  traitTypeId: number;
  type: SingularTraitName;
  imageData: ImageData | undefined;
}

export type Recipient = {
  id?: number;
  name?: string;
  description?: string;
  image?: string;
  active?: boolean;
  website?: string;
};
