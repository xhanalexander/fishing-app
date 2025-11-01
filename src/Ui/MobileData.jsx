import { usePartyKitStore } from "../hooks";
import QRCode from "react-qr-code";

export const MobileData = () => {
  const roomId = usePartyKitStore((state) => state.room);
  const baseUrl = window.location.origin;
  console.log(baseUrl);
  return (
    <>
      {roomId && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1000,
            background: "white",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <QRCode value={`${baseUrl}/?room=${roomId}`} size={150} />
        </div>
      )}
    </>
  );
};
