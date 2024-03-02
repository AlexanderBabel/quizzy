import QRCode from 'react-qr-code';

function QrGenerator({ lobbyCode, size = 128 }) {
  return (
    <div className="QrCode">
      <QRCode
        title="Join the game"
        value={`${process.env.REACT_APP_API_ENDPOINT}/join/${lobbyCode}`}
        bgColor="#FFFFFF"
        fgColor="#000000"
        size={size}
      />
    </div>
  );
}

export default QrGenerator;
