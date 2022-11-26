import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAccount, useContractRead } from "wagmi";
import { Donation, Request } from "../../types";
import NextButton from "./NextButton";
import AddTrait from "./AddTrait";
import AddOrg from "./AddOrg";
import Confirm from "./Confirm";
import cx from "classnames";
import { utils } from "ethers";
import { nounSeekContract } from "../../config";

const Add: NextPage = () => {
  const { isConnected, isConnecting } = useAccount();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [requestSeed, setRequestSeed] = useState<Request | undefined>();

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
  
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  }

  const checkProgress = () => {
    const amount = requestSeed?.donation?.amount || 0;
    const amountInEth = parseFloat(utils.formatEther(amount));
    if (currentStep === 0 && requestSeed?.trait.name) {
      console.log('ready for step 2', requestSeed.trait.name);
      return true;
    } else if (currentStep === 1 && amountInEth > 0 && requestSeed?.donation?.to) {
      console.log('ready for step 3', requestSeed);
      return true;
    } else {
      return false;
    }
  }

  const doneesList = useContractRead({
    address: nounSeekContract.address,
    abi: nounSeekContract.abi,
    functionName: 'donees',
  }).data;
  
  if (!isConnected) return null;
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-center">Sponsor a Noun trait</h1>
      {/* Stepper */}
      <div className="max-w-4xl mx-auto my-4 p-5 border border-slate-200 pb-4 bg-slate-100">	
        <div className="flex p-1 justify-center gap-5 bg-white border-slate-200 border-2 items-center rounded-lg">
          {steps.map((step, i) => {
            return (
              <button 
                className={cx(
                  "min-w-30 text-lg text-left text-slate flex flex-row p-3 gap-2 justify-center items-center rounded-lg", 
                  currentStep === i && "",
                  i > currentStep && "opacity-40 hover:opacity-80"
                )}
                onClick={() => (requestSeed?.donation || i < currentStep) && setCurrentStep(i)}
                disabled={(requestSeed?.donation || i < currentStep) ? false : true}
              > 
                <p className={cx(
                  "text-sm font-bold rounded-full text-center aspect-square h-10 leading-10", 
                  i < currentStep ? "bg-blue-700 text-white" 
                  : "text-blue-700 border-blue-700 border-2",
                  i > currentStep && "border-slate-400 text-slate-400",
                )}>
                  {i < currentStep ? "✓" : i + 1}
                </p>
                <p className={cx(
                  "text-sm", 
                  i === currentStep && "text-blue-700 font-bold"
                )}>{step.title}</p>
              </button>
            )
          })}
        </div>
          {/* Step wrapper */}
          <div className="">
            {currentStep === 0 && (
              <>
                <AddTrait
                  setRequestSeed={setRequestSeed}
                  requestSeed={requestSeed}
                 />
                 <div className="fixed bottom-0 bg-white w-full p-2 left-0 text-center">
                  <NextButton 
                    isActive={checkProgress()} 
                    handleNextStep={handleNextStep}
                  />
                </div>
              </>
            )}
            {currentStep === 1 && (
              <>
                <AddOrg
                  setRequestSeed={setRequestSeed}
                  requestSeed={requestSeed}
                />
                <div className="fixed bottom-0 bg-white w-full p-2 left-0 text-center flex gap-5 justify-center">
                  <button 
                    className="underline text-slate-500"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Back
                  </button>
                  <NextButton 
                    isActive={checkProgress()} 
                    handleNextStep={handleNextStep}
                  />
                </div>
              </>
            )}
            {currentStep === 2 && (
              <>
                <Confirm 
                  requestSeed={requestSeed} 
                  setRequestSeed={setRequestSeed}
                  setCurrentStep={setCurrentStep}
                />
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default Add;
