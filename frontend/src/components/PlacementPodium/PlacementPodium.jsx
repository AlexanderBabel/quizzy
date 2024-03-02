import useGame from "../../context/useGame";
import "./PlacementPodium.css";

export default function PlacementPodium() {
  const { gameState } = useGame();
  const scores = gameState?.results?.scores;

  return (
    <div id="PlacementPodiums">
      {scores && scores.length >= 2 && (
        <div className="PodiumWrapper">
          <h1 id="playerName">{scores[1]?.name}</h1>
          <div id="FirstPodium" className="podium">
            <div className="placementBackground">
              {" "}
              <h1 className="placementText">2</h1>
            </div>
          </div>
          <h1 id="playerPoints">{scores[1].score}p</h1>
        </div>
      )}
      {scores && scores.length >= 1 && (
        <div className="PodiumWrapper">
          <h1 id="playerName">{scores[0]?.name}</h1>

          <div id="SecondPodium" className="podium">
            <div className="placementBackground">
              {" "}
              <h1 className="placementText">1</h1>
            </div>
          </div>
          <h1 id="playerPoints">{scores[0]?.score}p</h1>
        </div>
      )}
      {scores && scores.length >= 3 && (
        <div className="PodiumWrapper">
          <h1 id="playerName">{scores[2]?.name}</h1>
          <div id="ThirdPodium" className="podium">
            <div className="placementBackground">
              {" "}
              <h1 className="placementText">3</h1>
            </div>
          </div>
          <h1 id="playerPoints">{scores[2]?.score}p</h1>
        </div>
      )}
    </div>
  );
}
