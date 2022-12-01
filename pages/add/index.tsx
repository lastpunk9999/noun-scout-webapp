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
import { parseTraitName, capitalizeFirstLetter } from "../../utils";
import { nounSeekContract } from "../../config";
import RequestCard from "../../components/RequestCard";
import useGetDoneeDescription from "../../hooks/useGetDoneeDescription";
import ConfirmButton from "./ConfirmButton";
import RequestInText from "../../components/RequestInText";

const Add: NextPage = () => {
  const { isConnected, isConnecting } = useAccount();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [requestSeed, setRequestSeed] = useState<Request | undefined>();

  useEffect(() => {
    if (isConnecting || !router) return;
    if (isConnected) return;
    // router.push("/");
  }, [isConnected, isConnecting, router]);

  const steps = [
    {
      title: "Choose a trait",
      description: "Aenean eu leo quam. Pellentesque ornare sem lacinia quam.",
    },
    {
      title: "Select charity",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      title: "Confirm",
      description: "Donec sed odio dui.",
    },
  ];

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const checkProgress = () => {
    const amount = requestSeed?.donation?.amount || 0;
    const amountInEth = parseFloat(utils.formatEther(amount));
    if (currentStep === 0 && requestSeed?.trait?.name) {
      console.log("ready for step 2", requestSeed.trait.name);
      return true;
    } else if (
      currentStep === 1 &&
      amountInEth > 0 &&
      requestSeed?.donation?.to
    ) {
      console.log("ready for step 3", requestSeed);
      return true;
    } else {
      return false;
    }
  };

  const doneesList = useContractRead({
    address: nounSeekContract.address,
    abi: nounSeekContract.abi,
    functionName: "donees",
  }).data;

  const doneeDescription = useGetDoneeDescription(
    requestSeed?.donation?.to || 0
  );

  return (
    <div className="flex flex-col md:flex-row">
      <div
        className={cx(
          "flex flex-col w-2/5 max-w-[40rem] p-10 h-screen justify-center gap-10 items-center sticky top-0",
          // currentStep === 2 && "!w-full"
          currentStep === 2 && "hidden"
        )}
      >
        <div className="flex flex-col gap-2"></div>
        {currentStep > 0 || requestSeed ? (
          <>
            <h1 className="text-3xl font-bold font-serif mb-0">
              Build your request
            </h1>
            <RequestCard
              // id={requestSeed.id}
              trait={requestSeed && requestSeed.trait}
              donations={requestSeed && [requestSeed.donation]}
            />
            <RequestInText requestSeed={requestSeed} />
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold font-serif mb-0">
              Want a Noun Trait minted?
            </h1>
            <h2 className="text-lg">
              1.Create a request with an amount of ETH to incentivize minting{" "}
              <br />
              2. When a Noun with your trait is minted, the ETH will be sent to
              a non-profit of your choice
            </h2>
            <p>
              Nouns are minted once every 24 hours, so each day is another
              opportunity to mint your trait
            </p>
          </>
        )}

        <div className="">
          {currentStep === 0 && (
            <NextButton
              isActive={checkProgress()}
              handleNextStep={handleNextStep}
            />
          )}
          {currentStep === 1 && (
            <div className="flex flex-col md:flex-row-reverse gap-3">
              <NextButton
                isActive={checkProgress()}
                handleNextStep={handleNextStep}
              />
              <button
                className="underline text-slate-500"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </button>
            </div>
          )}
          {/* {currentStep === 2 && (
            <div className="flex flex-col md:flex-row-reverse gap-3">
              <ConfirmButton
                requestSeed={requestSeed}
                setRequestSeed={setRequestSeed}
                setCurrentStep={setCurrentStep}
              />
              <button
                className="underline text-slate-500"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </button>
            </div>
          )} */}
        </div>
      </div>
      {/* Stepper */}
      <div
        className={cx(
          "w-3/5 mx-auto border border-slate-200 border-top-0 bg-white p-10",
          // currentStep === 2 && "!w-0"
          currentStep === 2 && "!w-full"
        )}
      >
        <div className="flex p-1 justify-center gap-3 items-center rounded-lg justify-self-end border border-slate-200">
          {steps.map((step, i) => {
            return (
              <button
                className={cx(
                  "min-w-30 text-lg text-left text-slate flex flex-row p-3 gap-2 justify-center items-center rounded-lg",
                  currentStep === i && "",
                  i > currentStep && "opacity-40 hover:opacity-80"
                )}
                onClick={() =>
                  (requestSeed?.donation || i < currentStep) &&
                  setCurrentStep(i)
                }
                disabled={
                  requestSeed?.donation || i < currentStep ? false : true
                }
              >
                <p
                  className={cx(
                    "text-sm font-bold rounded-full text-center aspect-square h-7 leading-6",
                    i < currentStep
                      ? "bg-blue-700 text-white"
                      : "text-blue-700 border-blue-700 border-2",
                    i > currentStep && "border-slate-400 text-slate-400"
                  )}
                >
                  {i < currentStep ? "✓" : i + 1}
                </p>
                <p
                  className={cx(
                    "text-sm leading-none",
                    i === currentStep && "text-blue-700 font-bold"
                  )}
                >
                  {step.title}
                </p>
              </button>
            );
          })}
        </div>
        {/* Step wrapper */}
        {currentStep === 0 && (
          <>
            <AddTrait
              setRequestSeed={setRequestSeed}
              requestSeed={requestSeed}
            />
            {/* <div className="fixed bottom-0 bg-white w-full p-2 left-0 text-center">
                  <NextButton 
                    isActive={checkProgress()} 
                    handleNextStep={handleNextStep}
                  />
                </div> */}
          </>
        )}
        {currentStep === 1 && (
          <>
            <AddOrg setRequestSeed={setRequestSeed} requestSeed={requestSeed} />
            {/* <div className="fixed bottom-0 bg-white w-full p-2 left-0 text-center flex gap-5 justify-center">
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
                </div> */}
          </>
        )}
        {currentStep === 2 && (
          <Confirm
            requestSeed={requestSeed}
            setRequestSeed={setRequestSeed}
            setCurrentStep={setCurrentStep}
            currentStep={currentStep}
          />
        )}
      </div>
    </div>
  );
};

export default Add;
