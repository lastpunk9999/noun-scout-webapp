import { ImageData, getPartData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import Image from "next/image";
import cx from "classnames";

type Props = {
  error?: boolean;
  head?: number;
  glasses?: number;
  size?: string;
};

const getNoun = (partData = []) => {
  const parts = partData.map(([partType, partIndex]) => {
    const data = getPartData(partType, partIndex);
    return { data };
  });
  const image = `data:image/svg+xml;base64,${btoa(
    buildSVG(parts, ImageData.palette)
  )}`;
  return image;
};

export const nounProfiles = Array.from(
  { length: 20 },
  () => Math.random() * 1
).map(() => {
  return {
    // bodies: Math.floor(Math.random() * 20),
    head: Math.floor(Math.random() * 242),
    glasses: Math.floor(Math.random() * 24),
  };
});

export default function NounChatBubble(props: Props) {
  {
    /* From https://layoutsfortailwind.lalokalabs.dev/ui/chat-box/ */
    console.log({ props });
    return (
      <div className="flex items-center">
        <div className="mr-4">
          <div
            className={cx(
              props.error && "bg-red-100 text-red font-bold",
              props.info ? "bg-slate-100" : "bg-slate-200",
              "rounded-full relative",
              "w-12 h-12"
            )}
          >
            <Image
              src={getNoun([
                ["bodies", props.bodies ?? 2],
                ["heads", props.head ?? Math.floor(Math.random() * 242)],
                ["glasses", props.glasses ?? Math.floor(Math.random() * 20)],
              ])}
              width="64"
              height="64"
              className={cx("w-full aspect-square rounded-full overflow-clip")}
            />
          </div>
        </div>
        <div
          className={cx(
            props.error ? "bg-red-100 text-red font-bold" : "text-black",
            props.info ? "bg-white" : "bg-slate-200",
            "text-white p-2 rounded-lg mb-2 relative inline  grow-0 "
          )}
        >
          <span
            className={cx(
              !props.size && "text-lg",
              props.size === "small" && "text-sm"
            )}
          >
            {props.children}
          </span>
          {/* <!-- arrow --> */}
          <div
            className={cx(
              props.error && "bg-red-100",
              props.info ? "bg-white" : "bg-slate-200",
              "absolute left-0 top-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2"
            )}
          ></div>
          {/* <!-- end arrow --> */}
        </div>
      </div>
    );
  }
}
