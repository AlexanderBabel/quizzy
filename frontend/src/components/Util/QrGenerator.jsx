import QRCode from 'react-qr-code';

function QrGenerator({ lobbyCode, size = 128 }) {
  return (
    <div className="QrCode">
      <QRCode
        title="Join the game"
        value={`${process.env.REACT_APP_API_ENDPOINT}/v1/${lobbyCode}`} //TODO change the url
        bgColor="#FFFFFF"
        fgColor="#000000"
        size={size}
      />
    </div>
  );
}

export default QrGenerator;
