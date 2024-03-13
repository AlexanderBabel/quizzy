import "./PostLobbyPage.css";
import background from "../../images/blob-scene-haikei-16.svg";
import StartGameBtn from "../../components/Buttons/StartGameBtn";
import PlacementPodium from "../../components/PlacementPodium/PlacementPodium";
import ResultList from "../../components/ResultList/ResultList";
import ReportQuizBtn from "../../components/Buttons/ReportQuizBtn";
import useGame from "../../context/useGame";
import { useNavigate } from "react-router-dom";
import useLobby, { GameRole, LobbyActionType } from "../../context/useLobby";
import { useSocketEvent } from "socket.io-react-hook";
import useAuthenticatedSocket from "../../context/useAuthenticatedSocket";

export default function PostLobbyPage() {
  const { gameState } = useGame();
  const { lobbyState, dispatch } = useLobby();
  const navigate = useNavigate();
  const scores = gameState?.results?.scores;
  const { socket } = useAuthenticatedSocket();
  const { sendMessage: leaveLobby } = useSocketEvent(socket, "lobby:leave");
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

  if (lobbyState?.role === GameRole.PLAYER) {
    return (
      <div className="PostLobbyPagePlayer" style={svgStyle}>
        <h3>See the host screen for more details</h3>
        <StartGameBtn
          text={"Quit"}
          onClick={() => {
            navigate("/");
            leaveLobby();
            dispatch({ type: LobbyActionType.LEAVE_LOBBY });
          }}
        />
        <div className="postLobbyPagePlayerResult">
          <h2>Place: {gameState?.results?.place}</h2>
          <h4>Score: {gameState?.results?.score}</h4>
        </div>
      </div>
    );
  }

  return (
    <div id="PostLobbyPage" style={svgStyle}>
      <div id="header">
        <div>
        <ReportQuizBtn />
        </div>
        <h1 id="postLobbyPageTitle" className="lobbyTitle">
          The Winner is...
        </h1>
        <div>
        <StartGameBtn
          text={"Quit"}
          onClick={() => {
            navigate("/");
            leaveLobby();
            dispatch({ type: LobbyActionType.LEAVE_LOBBY });
          }}
        />
        </div>
      </div>
      <PlacementPodium id="podiums" />
      {scores?.length > 3 && <ResultList id="resultList" />}
    </div>
  );
}
