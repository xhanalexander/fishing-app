
import { useHaptic } from "use-haptic";
import { Button } from "../components/Button";

export const AccessScreen = ({ setAccessGranted }) => {
  const { triggerHaptic } = useHaptic();

  const requestPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === "granted") {
          return true;
        } else {
          alert("Permission denied for motion sensors.");
          return false;
        }
      } catch (err) {
        console.error("Permission request error:", err);
        return false;
      }
    } else {
      return true;
    }
  };
  const handleActivate = async () => {
    triggerHaptic();
    const granted = await requestPermission();
    if (granted) {
      setAccessGranted(true);
    }
  };
  return (
    <>
      <p className="explanation">
        Please allow access to your device&apos;s accelerometer and gyroscope to
        enjoy the full experience.
      </p>
      <Button label={"Request Access"} onClick={handleActivate} />
    </>
  );
};
