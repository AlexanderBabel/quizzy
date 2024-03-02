import "./PlayerNameGrid.css";

export default function PlayerNameGrid({ players }) {
  return (
    <div id="PlayerNameGrid">
      {players.map(({ id, name }) => (
        <div key={id} className="playerName">
          {name}
        </div>
      ))}
    </div>
  );
}
