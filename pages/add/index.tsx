import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { Donation, RequestSeed } from "../../types";
import NextButton from "./NextButton";
import AddTrait from "./AddTrait";
import AddOrg from "./AddOrg";
import Confirm from "./Confirm";
import cx from "classnames";

const Add: NextPage = () => {
  const { isConnected, isConnecting } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnecting || !router) return;
    if (isConnected) return;
    router.push("/");
  }, [isConnected, isConnecting, router]);

  const steps = [
    {
      title: "Trait selection",
      description: "Aenean eu leo quam. Pellentesque ornare sem lacinia quam."
    },
    {
      title: "Support",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
      title: "Confirm",
      description: "Donec sed odio dui."
    },
  ];

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [requestSeed, setRequestSeed] = useState<RequestSeed | undefined>();
  
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  }
  console.log("requestSeed", requestSeed);

  if (!isConnected) return null;
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-center">Sponsor a Noun trait</h1>
      {/* Stepper */}
      <div className="max-w-xl mx-auto my-4 border-b-2 pb-4">	
        <div className="flex pb-3">
          {steps.map((step, i) => {
            return (
              <button 
                className={cx("flex-1 w-10 mx-auto text-lg text-left text-slate flex flex-col p-2", currentStep === i && "border-blue-500 border-2")}
                onClick={() => (requestSeed?.donation || i < currentStep) && setCurrentStep(i)}
                disabled={(requestSeed?.donation || i < currentStep) ? false : true}
              >
                <p>{step.title}</p>
                <p className="text-sm">{step.description}</p>
              </button>
            )
          })}
        </div>
        {/* <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            // disabled={!props.isActive} 
            onClick={() => setRequestTrait('f')}
          >
            test
          </button> */}
          {/* Step wrapper */}
          <div className="">
            {currentStep === 0 && (
              <>
                <AddTrait
                  setRequestSeed={setRequestSeed}
                  requestSeed={requestSeed}
                 />
                 <NextButton 
                  isActive={true} 
                  handleNextStep={handleNextStep}
                />
              </>
            )}
            {currentStep === 1 && (
              <>
                <AddOrg
                  setRequestSeed={setRequestSeed}
                />
                <NextButton 
                  isActive={true} 
                  handleNextStep={handleNextStep}
                />
              </>
            )}
            {currentStep === 2 && (
              <>
                <Confirm requestSeed={requestSeed} />
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default Add;
