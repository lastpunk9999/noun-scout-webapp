import { useEffect, useState } from "react";
import cx from "classnames";
type NextButtonProps = {
  isActive: boolean;
  handleNextStep: Function;
}

const NextButton = (props: NextButtonProps) => {

  return (
    <button 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={!props.isActive} 
        onClick={() => props.handleNextStep()}
    >
        Next
    </button>
  );
}

export default NextButton;
