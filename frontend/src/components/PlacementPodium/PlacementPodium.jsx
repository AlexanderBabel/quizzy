import "./PlacementPodium.css";

export default function PlacementPodium({ scores, players }) {
  return (
    <div id="PlacementPodiums">
      <div className="PodiumWrapper">
        <h1 id="playerName">{players[1]}</h1>
        <div id="FirstPodium">
          <div className="placementBackground">
            {" "}
            <h1 className="placementText">2</h1>
          </div>
        </div>
        <h1 id="playerPoints">{scores[1]}p</h1>
      </div>
      <div className="PodiumWrapper">
        <h1 id="playerName">{players[0]}</h1>

        <div id="SecondPodium">
          <div className="placementBackground">
            {" "}
            <h1 className="placementText">1</h1>
          </div>
        </div>
        <h1 id="playerPoints">{scores[0]}p</h1>
      </div>
      <div className="PodiumWrapper">
        <h1 id="playerName">{players[2]}</h1>
        <div id="ThirdPodium">
          <div className="placementBackground">
            {" "}
            <h1 className="placementText">3</h1>
          </div>
        </div>
        <h1 id="playerPoints">{scores[2]}p</h1>
      </div>
    </div>
  );
}
