import useFakeNoun from "../hooks/useFakeNoun";
import Image from "next/image";
import { DonationsByTraitType, NounSeed } from "../types";
import { useAppContext } from "../context/state";
import useGetDoneeDescription from "../hooks/useGetDoneeDescription";

type ExplainerNounProps = {
  nextAuctionDonations: DonationsByTraitType;
  nounSeed: NounSeed;
};

const ExplainerNoun = (props: ExplainerNounProps) => {
  // Get image data for next auctioned Noun
  const { src } = useFakeNoun(props.nextAuctionDonations, props.nounSeed);
  const doneesList = useAppContext()[0];
  const activeDonees = doneesList.filter((org) => org.active && org.image);
  const orgIndex = Math.floor(Math.random() * activeDonees.length);
  console.log("doneesList", orgIndex);
  const doneeDescription = useGetDoneeDescription(orgIndex);

  function getRandomNum(min, max, decimalPlaces) {
    const rand = Math.random() * (max - min) + min;
    const power = Math.pow(10, decimalPlaces);
    return Math.floor(rand * power) / power;
  }

  return (
    <div className="relative mx-auto">
      <div className="absolute -top-[6px] -left-[6px] z-10">
        <span className="p-1 bg-green-600 text-white font-bold text-sm block rounded-sm">
          Matched!
        </span>
      </div>
      <div className="bg-white p-2 flex flex-row gap-2 w-fit rounded-md shadow-md items-center absolute -bottom-[6px] -right-[20px]  z-10">
        <span>Ξ {getRandomNum(0, 10, 2)}</span>
        <Image
          src={`/example-arrow.svg`}
          alt="arrow"
          width={16}
          height={16}
          className="opacity-50"
        />
        <Image
          src={doneeDescription.image}
          alt="example logo"
          width={25}
          height={25}
        />
      </div>

      <Image
        src={src}
        alt="example trait image"
        className="w-full aspect-square rounded"
        layout="responsive"
        width={320}
        height={320}
      />
    </div>
  );
};

export default ExplainerNoun;
