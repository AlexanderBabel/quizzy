import QRCode from 'react-qr-code';

const baseUrl = `${window.location.origin}`;

function QrGenerator({ lobbyCode, size = 128 }) {
  return (
    <div className="QrCode">
      <QRCode
        title="Join the game"
        value={`${baseUrl}/join/${lobbyCode}`}
        bgColor="#FFFFFF"
        fgColor="#000000"
        size={size}
      />
    </div>
  );
}

export default QrGenerator;
