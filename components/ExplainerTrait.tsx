import { getNounData, getPartData, ImageData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import { BigNumber, utils } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import { nounsTokenContract } from "../config";
import useFakeNoun from "../hooks/useFakeNoun";
import useGetDonationsForUpcomingNoun from "../hooks/useGetDonationsForUpcomingNoun";
import Image from "next/image";
import {
  Donation,
  DonationsByTraitType,
  NounSeed,
  TraitAndDonations,
  TraitNameAndImageData,
} from "../types";
import { traitTypeNamesById } from "../utils";
import RequestCard from "./RequestCard";

type ExplainerTraitProps = {
  nextAuctionDonations: DonationsByTraitType;
  nounSeed: NounSeed;
};

const ExplainerTrait = (props: ExplainerTraitProps) => {
  const getPart = (partType: string, partIndex: number) => {
    const data = getPartData(partType, partIndex);
    const image = `data:image/svg+xml;base64,${btoa(
      buildSVG([{ data }], ImageData.palette)
    )}`;
    return { image };
  };
  const traitImage = getPart(traitTypeNamesById(3)[1], props.nounSeed.head);

  return (
    <div className="max-w-[10rem] mx-auto scale-125">
      <Image
        src={traitImage.image}
        alt="example trait image"
        className="w-full aspect-square rounded"
        layout="responsive"
        width={320}
        height={320}
      />
    </div>
  );
};

export default ExplainerTrait;
