import recipientDescriptions from "../content/recipientDescriptions";
import { Recipient } from "../types";
export default function buildRecipientDescription(
  onChainData,
  recipientId: number
): Recipient {
  return {
    id: recipientId,
    ...(onChainData ?? {}),
    ...(recipientDescriptions[recipientId] ?? {}),
    name:
      recipientDescriptions[recipientId]?.name ??
      onChainData?.name ??
      "Unknown cause",
    image:
      recipientDescriptions[recipientId]?.image ??
      "/recipients/placeholder.svg",
    description:
      recipientDescriptions[recipientId]?.description ??
      "Description coming soon.",
  } as Recipient;
}
