import { useEffect, useState } from "react";
import cx from "classnames";
type NextButtonProps = {
  isActive: boolean;
  handleNextStep: Function;
};

const NextButton = (props: NextButtonProps) => {
  return (
    <>
      <button
        className={cx(
          "text-white font-bold py-2 px-4 rounded",
          props.isActive ? "bg-blue-500 hover:bg-blue-700" : "bg-slate-400"
        )}
        disabled={!props.isActive}
        onClick={() => props.handleNextStep()}
      >
        <span className="md:hidden">→</span>
        <span className="hidden md:block">Continue</span>
      </button>
    </>
  );
};

export default NextButton;
