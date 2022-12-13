import { useAppContext } from "../context/state";
import Image from "next/image";
import useGetDoneeDescription from "../hooks/useGetDoneeDescription";
type ExplainerLogosProps = {};

const ExplainerLogos = (props: ExplainerLogosProps) => {
  const doneesList = useAppContext()[0];

  return (
    <div className="max-w-[8rem] mx-auto grid grid-cols-2">
      {doneesList.slice(0, 4).map((org, i) => {
        const doneeDescription = useGetDoneeDescription(i);
        if (org.active) {
          return (
            <div className="max-w-[4rem]">
              <Image
                src={doneeDescription.image}
                alt={`${doneeDescription.name} logo`}
                layout="responsive"
                width={320}
                height={320}
              />
            </div>
          );
        }
      })}
    </div>
  );
};

export default ExplainerLogos;
