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
import AddAmount from "./AddAmount";
import Link from "next/link";

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
      title: "Add amount",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
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
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const handleResetSteps = () => {
    setCurrentStep(0);
    setRequestSeed(undefined);
  };

  const checkProgress = () => {
    const amount = requestSeed?.donation?.amount || 0;
    const amountInEth = parseFloat(utils.formatEther(amount));
    console.log("check progress", amountInEth, amountInEth > 0);
    if (currentStep === 0 && requestSeed?.trait?.name) {
      // console.log("ready for step 2", requestSeed.trait.name);
      return true;
    } else if (currentStep === 1 && amountInEth > 0) {
      return true;
    } else if (
      currentStep === 2 &&
      amountInEth > 0 &&
      requestSeed?.donation?.to >= 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div
      className={cx(
        "flex flex-col md:flex-row",
        currentStep >= 3 && "justify-center"
      )}
    >
      <div
        className={cx(
          "flex flex-col w-2/5 max-w-[40rem] p-10 h-screen justify-center gap-10 items-center sticky top-0 transition-all duration-300",
          // currentStep === 3 && "hidden"
          currentStep >= 3 && "!w-full"
        )}
      >
        {/* <button
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400"
          onClick={() => {
            setCurrentStep(4);
          }}
        >
          go to confirm state
        </button> */}
        {currentStep === steps.length && (
          <div className="text-center">
            <h1 className="text-3xl font-bold font-serif mb-2 text-center">
              Your sponsorship has been submitted!
            </h1>
            <RequestInText requestSeed={requestSeed} />
            <div className="flex flex-col my-5 md:flex-row gap-5 md:justify-center">
              <button
                className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400"
                onClick={() => {
                  handleResetSteps();
                }}
              >
                Sponsor another Noun trait
              </button>
              <Link href="/manage">
                <a className="no-underline inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400">
                  Manage your sponsorships
                </a>
              </Link>
            </div>
          </div>
        )}
        {currentStep > 0 && currentStep < 3 && requestSeed && (
          <>
            <h1 className="text-3xl font-bold font-serif mb-0">
              Build your request
            </h1>
            <RequestCard
              cardStyle="detailed"
              trait={requestSeed && requestSeed.trait}
              donations={requestSeed && [requestSeed.donation]}
            />
            <RequestInText requestSeed={requestSeed} />
          </>
        )}
        {currentStep === 0 && (
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
        {currentStep === 3 && (
          <Confirm
            requestSeed={requestSeed}
            setRequestSeed={setRequestSeed}
            setCurrentStep={setCurrentStep}
            currentStep={currentStep}
          />
        )}

        {/* <div className="">
          {currentStep === 0 && (
            <NextButton
              isActive={checkProgress()}
              handleNextStep={handleNextStep}
            />
          )}
          {currentStep === 1 && (
            <div className="flex flex-col gap-3">
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
        </div> */}
      </div>
      {/* Stepper */}
      <div
        className={cx(
          "w-3/5 mx-auto border border-slate-200 border-top-0 bg-white p-10 justify-center w-full pb-[20rem] transition-all",
          // currentStep === 3 && "!w-full"
          currentStep >= 3 && "w-0 hidden"
        )}
      >
        {/* <div className="flex mx-auto p-1 mb-10 justify-center gap-3 items-center rounded-lg  border border-slate-200 max-w-lg">
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
        </div> */}
        {/* Step wrapper */}

        {currentStep < steps.length - 1 && (
          <div className="mt-10 mb-5">
            <span className="text-sm uppercase color-blue-500 opacity-70">
              step {currentStep + 1}
            </span>
            <h1 className="text-5xl font-bold">{steps[currentStep].title}</h1>
          </div>
        )}

        {currentStep === 0 && (
          <>
            <AddTrait
              setRequestSeed={setRequestSeed}
              requestSeed={requestSeed}
            />
          </>
        )}
        {currentStep === 1 && (
          <>
            <AddAmount
              setRequestSeed={setRequestSeed}
              requestSeed={requestSeed}
            />
          </>
        )}
        {currentStep === 2 && (
          <>
            <AddOrg setRequestSeed={setRequestSeed} requestSeed={requestSeed} />
          </>
        )}
        {currentStep === 3 && (
          <Confirm
            requestSeed={requestSeed}
            setRequestSeed={setRequestSeed}
            setCurrentStep={setCurrentStep}
            currentStep={currentStep}
          />
        )}
      </div>

      <div
        className={cx(
          "flex flex-row py-3 px-5 bg-white shadow-2xl fixed bottom-0 w-full text-center justify-center items-center"
          // currentStep === 3 && "!bg-transparent !shadow-none"
        )}
      >
        {currentStep < 3 && (
          <button
            className={cx(
              "underline text-slate-500",
              currentStep < 1 && "opacity-0"
            )}
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep < 1 && currentStep > 3 ? true : false}
          >
            Back
          </button>
        )}

        {/* Stepper */}

        <div className="flex bg-white mx-auto p-1 justify-center gap-3 items-center rounded-lg  border border-slate-200 max-w-lg">
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
        {currentStep < 3 && (
          <div className="">
            {currentStep < 3 && (
              <NextButton
                isActive={checkProgress()}
                handleNextStep={handleNextStep}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Add;
