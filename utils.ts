import { ImageData } from "@nouns/assets";

import {
  SingularTraitName,
  PluralTraitName,
  DonationsByTraitType,
  Donation,
  TraitAndDonations,
  TraitNameAndImageData,
  RequestStatus,
} from "./types";

const nounImages = ImageData.images;

type TraitNames = [SingularTraitName, PluralTraitName];

const traitNames = [
  ["background", "backgrounds"],
  ["body", "bodies"],
  ["accessory", "accessories"],
  ["head", "heads"],
  ["glasses", "glasses"],
] as TraitNames[];

export function capitalizeFirstLetter(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function parseTraitName(partName: string): string {
  return partName.substring(partName.indexOf("-") + 1).replace(/-/g, " ");
}

export function singularTraitToPlural(
  singularTrait: SingularTraitName
): PluralTraitName {
  return traitNames.find(
    (data) => data[0] === singularTrait
  )[1] as PluralTraitName;
}
export function pluralTraitToSingular(
  pluralTrait: PluralTraitName
): SingularTraitName {
  return traitNames.find(
    (data) => data[1] === pluralTrait
  )[0] as SingularTraitName;
}

export function traitTypeNamesById(
  index: number
): [SingularTraitName, PluralTraitName] {
  return traitNames[index];
}

const bgColorNames = ["Cool", "Warm"];

export function traitNamesById(traitTypeId: number, traitId: number): string {
  let traitName = "";
  traitTypeId === 0
    ? (traitName = bgColorNames[traitId])
    : (traitName = parseTraitName(
        nounImages[traitTypeNamesById(traitTypeId)[1]][traitId].filename
      ));
  return traitName;
}

export function getTraitTraitNameAndImageData(
  trait: number,
  traitId: number
): TraitNameAndImageData {
  const [singularTrait, pluralTrait] = traitTypeNamesById(trait);
  const imageData = nounImages[pluralTrait][traitId];
  const name = imageData.filename.replace(`${singularTrait}-`, "");
  return {
    name,
    traitId: traitId,
    traitTypeId: trait,
    type: singularTrait,
    imageData,
  };
}

export function extractDonations(donations, donees): DonationsByTraitType {
  return donations.reduce((obj, traitsArray, trait) => {
    const [singularTrait, pluralTrait] = traitTypeNamesById(trait);
    const traitsObj = traitsArray.reduce(
      (traitsObj, donateesArray, traitId) => {
        const donations = donateesArray
          .map((amount, doneeId) => {
            if (amount.isZero()) return;
            return {
              to: doneeId,
              amount,
            } as Donation;
          })
          .filter((n) => n);
        if (donations.length > 0) {
          traitsObj[traitId] = {
            trait: getTraitTraitNameAndImageData(trait, traitId),
            donations,
          } as TraitAndDonations;
        }
        return traitsObj;
      },
      {}
    );

    obj[pluralTrait] = traitsObj;
    return obj;
  }, {});
}

export function requestStatusToMessage(
  status: RequestStatus,
  requestsLength: number
): string {
  let message = "Can remove";
  switch (status) {
    case RequestStatus.AUCTION_ENDING_SOON:
      message = "Auction is ending soon.";
      break;
    case RequestStatus.DONATION_SENT:
      message = "Already matched.";
      break;
    case RequestStatus.MATCH_FOUND:
      message = `The current or previous Noun matches ${
        requestsLength > 1 ? "these sponsorships" : "this sponsorship"
      }.`;
      break;
    case RequestStatus.REMOVED:
      message = "Already removed.";
      break;
  }
  return message;
}
