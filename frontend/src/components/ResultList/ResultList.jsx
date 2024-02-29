import ResultListTile from "../ResultListTile/ResultListTile";

function ResultList({ players, playerScores }) {
  return (
    <div id="ResultList">
      {players.map((e) => (
        <ResultListTile
          className="playerName"
          placement={players.indexOf(e) + 4}
          name={e}
          score={playerScores[players.indexOf(e)]}
        ></ResultListTile>
      ))}
    </div>
  );
}

export default ResultList;
