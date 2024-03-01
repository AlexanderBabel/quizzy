import useGame from "../../context/useGame";
import ResultListTile from "../ResultListTile/ResultListTile";

export default function ResultList() {
  const { gameState } = useGame();
  const scores = gameState?.results?.scores;

  return (
    <div id="ResultList">
      {scores.slice(3).map(({ name, place, score }, index) => (
        <ResultListTile
          key={index}
          className="playerName"
          name={name}
          placement={place}
          score={score}
        ></ResultListTile>
      ))}
    </div>
  );
}
