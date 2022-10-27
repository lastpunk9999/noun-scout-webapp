import { ImageData } from "@nouns/assets";

import {
  SingularTraitName,
  PluralTraitName,
  DonationsByTraitType,
  Donation,
  TraitAndDonations,
  TraitNameAndImageData,
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

export function traitNamesByIndex(
  index: number
): [SingularTraitName, PluralTraitName] {
  return traitNames[index];
}

export function getTraitTraitNameAndImageData(
  trait: number,
  traitId: number
): TraitNameAndImageData {
  const [singularTrait, pluralTrait] = traitNamesByIndex(trait);
  const imageData = nounImages[pluralTrait][Number(traitId)];
  const name = imageData.filename.replace(`${singularTrait}-`, "");
  return { name, type: singularTrait, imageData };
}

export function extractDonations(donations, donees): DonationsByTraitType {
  return donations.reduce((obj, traitsArray, trait) => {
    const [singularTrait, pluralTrait] = traitNamesByIndex(trait);
    const traitsObj = traitsArray.reduce(
      (traitsObj, donateesArray, traitId) => {
        const donations = donateesArray
          .map((amount, doneeId) => {
            if (amount.eq("0")) return;
            return {
              to: donees[doneeId].name,
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
