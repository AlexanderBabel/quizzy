import "./WaitingPage.css";

export default function WaitingPage({
  text = "Waiting for other players to answer...",
}) {
  return (
    <div className="waiting-page">
      <div className="spinner"></div>
      <p className="loading-text">{text}</p>
    </div>
  );
}
