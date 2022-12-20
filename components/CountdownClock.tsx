import React from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";

type Props = {};

function CountdownClock({}: Props) {
  // TODO: @9999 to add timestamp from contract here
  const timestamp = new Date(Date.now() * 1000).toLocaleDateString("en-US");

  const countdownRenderer = (props: CountdownRenderProps) => {
    if (props.completed) {
      // Render a completed state
      return <p>Auction has ended</p>;
    } else {
      // Render a countdown
      return (
        <span>
          {props.hours}h: {props.minutes}m: {props.seconds}s
        </span>
      );
    }
  };
  return (
    <Countdown
      renderer={countdownRenderer}
      daysInHours={true}
      date={timestamp}
    />
  );
}

export default CountdownClock;
