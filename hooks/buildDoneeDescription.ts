import doneeDescriptions from "../content/doneeDescriptions";
import { Donee } from "../types";
export default function buildDoneeDescription(
  onChainData,
  doneeId: number
): Donee {
  return {
    id: doneeId,
    name:
      doneeDescriptions[doneeId]?.name ??
      onChainData?.name ??
      "Unknown non-profit",
    image: doneeDescriptions[doneeId]?.image ?? "/donees/placeholder.svg",
    description:
      doneeDescriptions[doneeId]?.description ?? "Description coming soon.",
  } as Donee;
}
