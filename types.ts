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

export interface Request {
  id: number;
  trait: TraitNameAndImageData;
  donation: Donation;
}

export interface RequestSeed {
  id?: number;
  traitTypeId?: number;
  traitId?: number;
  donation?: Donation;
}

export interface DonationsForNextNoun {
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
  type: SingularTraitName;
  imageData: ImageData;
}
