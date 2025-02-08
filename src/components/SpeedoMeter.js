import { useEffect, useState } from "react";

export default function SpeedoMeter({ value }) {
  // Current shown value
  const [currentValue, setCurrentValue] = useState(0);
  // Target Value to reach
  const [targetValue, setTargetValue] = useState(0);
  // Number of step to reach
  const steps = 10;
  // Latency between each step, if this is 0 then the count up/down is very instant and wont work
  const lag = 1;

  // Updating target value
  useEffect(() => {
    setTargetValue(value);
  }, [value]);

  // Updating Current value to follow target value, a feedback loop if made so that useEffect depencency can be leveraged.
  // Note: This is not super accurate in timing/animations
  useEffect(() => {
    if (currentValue !== targetValue) {
      setTimeout(() => {
        setCurrentValue((prevCurr) => {
          let distance = Math.abs(targetValue - currentValue);
          let stepSize = Math.ceil(distance / steps);
          return currentValue < targetValue
            ? currentValue + stepSize
            : currentValue - stepSize;
        });
      }, lag);
    }
  }, [currentValue, targetValue]);

  return (
    <div className="speedo-wrap">
      {(currentValue + "").split("").map((val, idx) => (
        <div className="speedo-digit" style={{ marginTop: `-${val}em` }}>
          <div data-val="0">0</div>
          <div data-val="1">1</div>
          <div data-val="2">2</div>
          <div data-val="3">3</div>
          <div data-val="4">4</div>
          <div data-val="5">5</div>
          <div data-val="6">6</div>
          <div data-val="7">7</div>
          <div data-val="8">8</div>
          <div data-val="9">9</div>
        </div>
      ))}
    </div>
  );
}
