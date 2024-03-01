import "./PostLobbyPage.css";
import background from "./../../images/blob-scene-haikei-4.svg";
import StartGameBtn from "../../components/Buttons/StartGameBtn";
import PlacementPodium from "../../components/PlacementPodium/PlacementPodium";
import ResultList from "../../components/ResultList/ResultList";
import ReportQuizBtn from "../../components/Buttons/ReportQuizBtn";
import useGame from "../../context/useGame";
import { useNavigate } from "react-router-dom";
import useLobby, { LobbyActionType } from "../../context/useLobby";

function PostLobbyPage() {
  const { gameState } = useGame();
  const { dispatch } = useLobby();
  const navigate = useNavigate();
  const scores = gameState?.results?.scores;
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

  if (!gameState.results) {
    navigate("/");
    return (
      <div className="answerQuizPage" style={svgStyle}>
        Not in a lobby
      </div>
    );
  }

  // TODO: design mobile UI (only show the score and place of the current player)
  return (
    <div id="PostLobbyPage" style={svgStyle}>
      <div id="header">
        <ReportQuizBtn />
        <h1 className="lobbyTitle">The Winner is...</h1>
        <StartGameBtn
          text={"Quit"}
          onClick={() => {
            navigate("/");
            dispatch({ type: LobbyActionType.LEAVE_LOBBY });
          }}
        />
      </div>
      <PlacementPodium id="podiums" />
      {scores?.length > 3 && <ResultList id="resultList" />}
    </div>
  );
}

export default PostLobbyPage;