import { useState } from "react";
import DottedGridBackground from "../components/DottedGridBackground";
import { AccessScreen } from "./AccessScreen";
import { ActiveScreen } from "./ActiveScreen";

export const MobileController = () => {
  const [accessGranted, setAccessGranted] = useState(false);
  return (
    <DottedGridBackground>
      {accessGranted ? (
        <ActiveScreen />
      ) : (
        <AccessScreen setAccessGranted={setAccessGranted} />
      )}
    </DottedGridBackground>
  );
};
