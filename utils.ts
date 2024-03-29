import { ImageData } from "@nouns/assets";
import { BigNumber, constants } from "ethers";

import {
  SingularTraitName,
  PluralTraitName,
  PledgesByTraitType,
  Pledge,
  TraitAndPledges,
  TraitNameAndImageData,
  RequestStatus,
  BigNumberType,
} from "./types";

export const nounImages = {
  backgrounds: [
    {
      filename: "Cool",
      data: "",
    },
    {
      filename: "Warm",
      data: "",
    },
  ],
  ...ImageData.images,
};

type TraitNames = [SingularTraitName, PluralTraitName];

export const traitNames = [
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
  let traitName = parseTraitName(
    nounImages[traitTypeNamesById(traitTypeId)[1]][traitId].filename
  );
  return traitName;
}

export function getTraitTraitNameAndImageData(
  traitTypeId: number,
  traitId: number
): TraitNameAndImageData {
  const [singularTrait, pluralTrait] = traitTypeNamesById(traitTypeId);
  const imageData = nounImages[pluralTrait][traitId];
  const name = traitNamesById(traitTypeId, traitId);
  return {
    name,
    traitId,
    traitTypeId,
    type: singularTrait,
    imageData,
  };
}

export function effectiveBPS(
  baseReimbursementBPS: number,
  minReimbursement: BigNumberType,
  maxReimbursement: BigNumberType,
  total: BigNumberType
): number {
  let effectiveBPS = 0;

  const denominator = BigNumber.from("10000");
  if (total.isZero()) {
    return effectiveBPS;
  }

  effectiveBPS = baseReimbursementBPS;
  let reimbursement = total
    .mul(BigNumber.from(String(effectiveBPS)))
    .div(denominator);

  // // When the default reimbursement is above the maximum reimbursement amount
  if (reimbursement.gt(maxReimbursement)) {
    effectiveBPS = maxReimbursement.mul(denominator).div(total).toNumber();
  } else if (reimbursement.lt(minReimbursement) && total.gt(minReimbursement)) {
    effectiveBPS = minReimbursement.mul(denominator).div(total).toNumber();
  }
  return effectiveBPS;
}
export function extractPledges(
  pledges,
  recipients,
  nounId,
  baseReimbursementBPS,
  minReimbursement,
  maxReimbursement
): PledgesByTraitType {
  return pledges.reduce((obj, traitsArray, trait) => {
    const [singularTrait, pluralTrait] = traitTypeNamesById(trait);
    const traitsObj = traitsArray.reduce(
      (traitsObj, donateesArray, traitId) => {
        const pledges = donateesArray
          .map((amount, recipientId) => {
            if (amount.isZero()) return;
            return {
              to: recipientId,
              amount,
            } as Pledge;
          })
          .filter((n) => n)
          .sort((a, b) => (a.amount.lt(b.amount) ? 1 : -1));
        if (pledges.length > 0) {
          let total = pledges.reduce(
            (sum, d) => sum.add(d.amount),
            constants.Zero
          );
          const reimbursementBPS = effectiveBPS(
            baseReimbursementBPS,
            minReimbursement,
            maxReimbursement,
            total
          );
          traitsObj[traitId] = {
            nounId,
            trait: getTraitTraitNameAndImageData(trait, traitId),
            pledges,
            total,
            reimbursementBPS,
          } as TraitAndPledges;
        }
        return traitsObj;
      },
      {}
    );

    obj[pluralTrait] = traitsObj;
    return obj;
  }, {});
}

export function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

export const traitPreposition = (trait: TraitNameAndImageData) =>
  !/glasses/.test(trait.type) &&
  (/^[a,e,i,o,u]/i.test(trait.name) ? "an " : "a ");

export function isNonAuctionedNounId(nounId: number | undefined) {
  return (
    nounId !== undefined && nounId !== 0 && nounId % 10 === 0 && nounId <= 1820
  );
}
