import { Button } from "../components/Button";
import { useEffect, useRef } from "react";
import { useHaptic } from "use-haptic";
import { normalizeYaw } from "@/utils";
import { usePartyKitStore } from "../../hooks";

export const ActiveScreen = () => {
  const calibrationRef = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const latestOrientation = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const { triggerHaptic } = useHaptic();
  const sendData = usePartyKitStore((state) => state.sendData);
  
  const handleOrientation = (event) => {
    latestOrientation.current = {
      alpha: normalizeYaw(event.alpha || 0),
      beta: event.beta || 0,
      gamma: event.gamma || 0,
    };
  };

  const handleRecalibrate = () => {
    triggerHaptic();
    calibrationRef.current = { ...latestOrientation.current };
  };

  useEffect(() => {
    window.addEventListener("deviceorientation", handleOrientation);

    const interval = setInterval(() => {
      const raw = latestOrientation.current;
      const calibration = calibrationRef.current;

      const calibrated = {
        alpha: normalizeYaw(raw.alpha - calibration.alpha),
        beta: raw.beta - calibration.beta,
        gamma: raw.gamma - calibration.gamma,
      };

      sendData({
        type: "orientation",
        ...calibrated,
        timestamp: Date.now(),
      });
    }, 16);

    return () => {
      clearInterval(interval);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [sendData]);
  return (
    <>
      <Button label="A" className={"A-button"} onClick={handleRecalibrate} />
      <p className="explanation">
        Tap the A button to recalibrate the accelerometer.
      </p>
    </>
  );
};
