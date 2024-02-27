import "./PostLobbyPage.css";
import background from "./../../images/blob-scene-haikei-4.svg";
import StartGameBtn from "../../components/Buttons/StartGameBtn";
import PlacementPodium from "../../components/PlacementPodium/PlacementPodium";
import ResultList from "../../components/ResultList/ResultList";
import ReportQuizBtn from "../../components/Buttons/ReportQuizBtn";

function PostLobbyPage() {


  var playerNames = ["Jocke", "Lucas", "Natasha", "Jocke", "Lucas", "Natasha", "Jocke", "Lucas", "Natasha"]
  var playerScores = ["973", "675", "432", "973", "675", "432", "973", "675", "432"]

  const svgStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    width: "100vw",
    height: "100vh",
    margin: 0,
    padding: 0,
    overflow: "hidden",
  };

  return (
    <div id="PostLobbyPage" style={svgStyle}>
        <div id="header">
          <ReportQuizBtn></ReportQuizBtn>
          <h1 className="lobbyTitle">The Winner is...</h1>
          <StartGameBtn text={"Quit"}></StartGameBtn>
          </div>
      <PlacementPodium id="podiums" scores={playerScores} players={playerNames}></PlacementPodium>
      <ResultList id="resultList" players={playerNames} playerScores={playerScores}></ResultList>
    </div>
  );
}

export default PostLobbyPage;
