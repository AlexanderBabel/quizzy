import "./PlayerScore.css";

export default function PlayerScore({ playerName, playerScore }) {
  return (
    <div className="playerScoreWrapper">
      <div>{playerName}</div>
      <div>{playerScore}</div>
    </div>
  );
}
