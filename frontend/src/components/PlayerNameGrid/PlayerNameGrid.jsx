import "./PlayerNameGrid.css";

export default function PlayerNameGrid({ players }) {
  return (
    <div id="PlayerNameGrid">
      <div className="NameContainer">
        {players.map((e) => (
          <p className="playerName">{e}</p>
        ))}
      </div>
    </div>
  );
}
