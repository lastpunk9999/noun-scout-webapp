import { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { Request } from "../../types";
import NextButton from "../../components/add/NextButton";
import AddTrait from "../../components/add/AddTrait";
import AddOrg from "../../components/add/AddOrg";
import Confirm from "../../components/add/Confirm";
import cx from "classnames";
import { utils } from "ethers";
import RequestCard from "../../components/RequestCard";
import RequestInText from "../../components/RequestInText";
import AddAmount from "../../components/add/AddAmount";
import Link from "next/link";
import { useAppContext } from "../../context/state";
import NounChatBubble, { nounProfiles } from "../../components/NounChatBubble";

const Add = (props) => {
  const { ANY_AUCTION_ID, ANY_NON_AUCTION_ID } = useAppContext() ?? {};

  const urlParams = new URLSearchParams(window.location.search.toLowerCase());
  const nounId =
    urlParams.get("nonauction") || urlParams.get("non-auction")
      ? ANY_NON_AUCTION_ID
      : ANY_AUCTION_ID;

  const { isConnected, isConnecting } = useAccount();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const defaultSeed: Request = {
    nounId,
  } as Request;
  const [requestSeed, _setRequestSeed] = useState<Request>(defaultSeed);
  useEffect(() => {
    setRequestSeed({
      ...requestSeed,
      nounId,
    });
  }, [nounId]);
  const setRequestSeed = useCallback(
    (newRequestSeed) => {
      if (!newRequestSeed) return _setRequestSeed(defaultSeed);
      _setRequestSeed((currentRequestSeed) => ({
        ...currentRequestSeed,
        ...newRequestSeed,
      }));
    },
    [_setRequestSeed]
  );
  const { baseReimbursementBPS: reimbursementBPS = 250 } =
    useAppContext() ?? {};

  useEffect(() => {
    if (isConnecting || !router) return;
    if (isConnected) return;
    // router.push("/");
  }, [isConnected, isConnecting, router]);

  const steps = [
    {
      title: "Choose a trait",
    },
    {
      title: "Pledge ETH",
    },
    {
      title: "Choose a charity",
    },
    {
      title: "Confirm",
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

  const amount = requestSeed?.pledge?.amount || 0;
  const amountInEth = parseFloat(utils.formatEther(amount));
  const stepRequirements = [
    requestSeed?.trait?.name ? true : false,
    amountInEth > 0,
    requestSeed?.pledge?.to >= 0,
  ];

  const isStepReady = (step: number) => {
    if (currentStep < 3) {
      if (stepRequirements[step]) {
        return true;
      } else {
        return false;
      }
    }
  };
  const isStepComplete = (step: number) => {
    if (step < 3) {
      if (stepRequirements[step]) {
        return true;
      } else {
        return false;
      }
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
          "flex md:flex-col md:w-2/5 py-3 px-5 md:py-10 md:px-10 md:h-screen md:justify-center gap-10 items-center md:sticky md:top-0 transition-all duration-300",
          currentStep >= 3 && "!w-full !max-w-none"
        )}
      >
        <div className="md:max-w-[40rem]">
          {currentStep === steps.length && (
            <div className="text-center">
              <h1 className="text-3xl font-bold font-serif mb-2 text-center">
                Your request has been submitted!
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
                    Manage your requests
                  </a>
                </Link>
              </div>
            </div>
          )}
          {currentStep >= 0 && currentStep < 3 && (
            <div className="flex flex-col w-full mb-2 md:mb-0">
              <div className="hidden md:block my-8">
                <RequestCard
                  cardStyle="detailed"
                  nounId={requestSeed.nounId}
                  trait={requestSeed && requestSeed.trait}
                  pledges={requestSeed && [requestSeed.pledge]}
                  reimbursementBPS={reimbursementBPS}
                />
              </div>
              {currentStep < 3 && currentStep > 0 && (
                <NounChatBubble
                  info="true"
                  {...nounProfiles[0]}
                  className="hidden md:flex"
                >
                  <span className="text-lg">
                    Keep going to complete this card, its how others will see
                    your request.
                  </span>
                </NounChatBubble>
              )}
              {currentStep === 0 && (
                <>
                  <NounChatBubble
                    info="true"
                    {...nounProfiles[8]}
                    className="hidden md:flex"
                  >
                    <span className="text-lg">
                      Traits that appear on recent Nouns can't be selected
                    </span>
                  </NounChatBubble>
                  <NounChatBubble
                    info="true"
                    {...nounProfiles[9]}
                    className="hidden md:flex"
                  >
                    <span className="text-lg">Because reasons</span>
                  </NounChatBubble>
                  <NounChatBubble
                    info="true"
                    {...nounProfiles[10]}
                    className="hidden md:flex"
                  >
                    <span className="text-lg">
                      If you wanted one of them, come back in a day or so
                    </span>
                  </NounChatBubble>
                </>
              )}
              {/* {currentStep > 0 && (
                <NounChatBubble
                  info="true"
                  {...nounProfiles[1]}
                  className="hidden md:flex"
                >
                  <span className="text-lg">
                    Your request will stay open until
                    <br />
                    you withrdaw your funds.
                  </span>
                </NounChatBubble>
              )}
              {currentStep > 1 && requestSeed.pledge?.amount !== undefined && (
                <NounChatBubble
                  info="true"
                  {...nounProfiles[3]}
                  className="hidden md:flex"
                >
                  <span className="text-lg">
                    You can withdraw at (almost) any time.
                  </span>
                </NounChatBubble>
              )} */}
              {currentStep > 1 && requestSeed.pledge?.to !== undefined && (
                <NounChatBubble
                  info="true"
                  {...nounProfiles[2]}
                  className="hidden md:flex"
                >
                  <span className="text-lg">Time to submit!</span>
                </NounChatBubble>
              )}
            </div>
          )}
          {false && currentStep === 0 && !requestSeed && (
            <div className="hidden md:block">
              <h1 className="text-center md:text-left text-3xl lg:text-5xl font-bold font-serif mb-5">
                Want a Noun Trait minted?
              </h1>

              <ol className="bg-white flex flex-col list-decimal mb-5 rounded-lg border border-slate-200">
                <li className="lg:text-lg p-5 leading-snug ml-10 pl-3">
                  Create a request and pledge ETH to a non-profit of your
                  choice.
                </li>
                <hr />
                <li className="lg:text-lg p-5 leading-snug ml-10 pl-3">
                  When a Noun with your trait is minted, the ETH will be sent to
                  your non-profit.
                </li>
                <hr />
                <li className="lg:text-lg p-5 leading-snug ml-10 pl-3">
                  If a Noun is not minted with your trait, you can choose to
                  leave the request open for the next Noun or remove it.
                  Removing your request withdraws your funds.
                </li>
              </ol>
              <NounChatBubble>
                <span className="text-sm lg:text-lg">
                  Nouns are minted once every 24 hours, so each day is another
                  opportunity to mint your trait and make a donation.
                </span>
              </NounChatBubble>
              {/* <p className="text-lg leading-tight">
                Nouns are minted once every 24 hours, so each day is another
                opportunity to mint your trait and make a donation.
              </p> */}
            </div>
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
      </div>
      {/* Stepper */}
      <div
        className={cx(
          "w-full md:w-3/5 mx-auto border border-slate-200 border-top-0 bg-white justify-center pb-[5rem] transition-all relative",
          currentStep >= 3 && "w-0 hidden"
        )}
      >
        {/* Step wrapper */}
        <div
          className={cx(
            "w-full md:w-3/5 flex flex-row gap-2 md:gap-5 p-2 md:px-10 md:py-2 sticky md:fixed z-10 top-0 bg-white text-center items-center shadow-sm justify-between "
          )}
        >
          <div className="flex bg-white p-1 justify-center gap-2 w-full items-center rounded-lg border border-slate-200">
            {steps.map((step, i) => {
              return (
                <button
                  className={cx(
                    "md:min-w-30 text-lg text-center lg:text-left text-slate flex flex-col gap-1 p-1 lg:flex-row lg:gap-2 lg:p-3 justify-center items-center rounded-lg",
                    currentStep === i && "",
                    i > currentStep && "opacity-40",
                    isStepReady(i) && "opacity-100"
                  )}
                  key={i}
                  onClick={() =>
                    (requestSeed?.pledge || i < currentStep) &&
                    setCurrentStep(i)
                  }
                  disabled={!isStepReady(i)}
                >
                  <p
                    className={cx(
                      "text-sm font-bold rounded-full text-center aspect-square h-7 leading-6",
                      i < currentStep ||
                        (isStepComplete(i) && i === currentStep)
                        ? "bg-blue-700 text-white"
                        : "text-blue-700 border-blue-700 border-2",

                      i > currentStep && "border-slate-400 text-slate-400"
                    )}
                  >
                    {isStepComplete(i) ? "✓" : i + 1}
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
                  isActive={isStepReady(currentStep)}
                  handleNextStep={handleNextStep}
                />
              )}
            </div>
          )}
        </div>
        {/* step content wrapper */}
        <div className="px-4 md:p-10 md:mt-[5rem]">
          {currentStep < steps.length - 1 && (
            <div className="mt-5 md:mt-10 mb-5">
              <p className="text-sm uppercase color-blue-500 opacity-70 block">
                step {currentStep + 1}
              </p>
              <div className="sm:flex gap-5 items-start flex-wrap">
                <h1 className="text-5xl font-bold inline-block mb-0">
                  {steps[currentStep].title}
                </h1>
                {currentStep < 3 && (
                  <div className="hidden sm:block">
                    {isStepReady(currentStep) && (
                      <NextButton
                        isActive={isStepReady(currentStep)}
                        handleNextStep={handleNextStep}
                        text="Continue →"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 0 && (
            <AddTrait
              setRequestSeed={setRequestSeed}
              requestSeed={requestSeed}
            />
          )}
          {currentStep === 1 && (
            <AddAmount
              setRequestSeed={setRequestSeed}
              requestSeed={requestSeed}
            />
          )}
          {currentStep === 2 && (
            <AddOrg setRequestSeed={setRequestSeed} requestSeed={requestSeed} />
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
      </div>
    </div>
  );
};

const MountedPageGuard = (props) => {
  if (!props.isMounted) return null;
  return <Add />;
};

export default MountedPageGuard;
