import "./PlayerNameGrid.css";

export default function PlayerNameGrid({ players }) {
  return (
    <div id="PlayerNameGrid">
      <div className="NameContainer">
        {players.map(({ id, name }) => (
          <p key={id} className="playerName">
            {name}
          </p>
        ))}
      </div>
    </div>
  );
}
