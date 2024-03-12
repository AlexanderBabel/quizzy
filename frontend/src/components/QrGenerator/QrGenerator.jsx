import QRCode from "react-qr-code";
import "./QrGenerator.css";

export default function QrGenerator({ url, size = 128 }) {
  return (
    <div className="QrCode">
      <QRCode
        title="Join the game"
        value={url}
        bgColor="#FFFFFF"
        fgColor="#000000"
        size={size}
      />
    </div>
  );
}
