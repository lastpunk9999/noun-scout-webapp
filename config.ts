import nounSeekABI from "./abi/nounSeekABI";

export const nounSeekContract = {
  address: process.env.NEXT_PUBLIC_NOUNSEEK_ADDRESS,
  abi: nounSeekABI as const,
};
