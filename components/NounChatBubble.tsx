import { ImageData, getPartData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import Image from "next/image";
import cx from "classnames";

// type Props = {
//   error?: boolean;
//   head?: number | string;
//   body?: number | string;
//   glasses?: number | string;
//   size?: string;
//   info?: boolean;
//   className?: string;
//   children?: JSX.Element | string | string[];
// };

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
  { length: 30 },
  () => Math.random() * 1
).map(() => {
  return {
    body: 2,
    head: Math.floor(Math.random() * 234),
    glasses: Math.floor(Math.random() * 20),
  };
});

export default function NounChatBubble(props) {
  {
    /* From https://layoutsfortailwind.lalokalabs.dev/ui/chat-box/ */

    return (
      <div className={cx("flex items-center", props.className)}>
        <div className="mr-4">
          <div
            className={cx(
              props.error && "bg-red-100 text-red font-bold",
              props.info ? "bg-warm" : "bg-slate-200",
              "rounded-full relative",
              props.size === "large" ? "w-14 h-14" : "w-12 h-12"
            )}
          >
            <Image
              src={getNoun([
                ["bodies", props.body ?? 2],
                ["heads", props.head ?? Math.floor(Math.random() * 242)],
                ["glasses", props.glasses ?? Math.floor(Math.random() * 22)],
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
