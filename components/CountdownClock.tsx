import React from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";

type Props = {
  endTime: number;
};

function CountdownClock(props: Props) {
  const countdownRenderer = (props: CountdownRenderProps) => {
    if (props.completed) {
      // Render a completed state
      return "now!";
    } else {
      // Render a countdown
      return (
        <>
          in {props.hours > 0 && <>{props.formatted.hours}h: </>}
          {props.formatted.minutes}m: {props.formatted.seconds}s
        </>
      );
    }
  };
  return (
    <Countdown
      renderer={countdownRenderer}
      date={props.endTime * 1000}
      zeroPadTime={2}
    />
  );
}

export default CountdownClock;
