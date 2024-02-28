import "./LobbyPage.css";
import background from "./../../images/blob-scene-haikei-2.svg";
import StartGameBtn from "../../components/Buttons/StartGameBtn";
import PlayerCounter from "../../components/PlayerCounter/PlayerCounter";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

import { useSocketEvent } from "socket.io-react-hook";
import useAuthenticatedSocket from "../../context/useAuthenticatedSocket";
import useLobby, { GameRole, LobbyActionType } from "../../context/useLobby";
import PlayerNameGrid from "../../components/PlayerNameGrid/PlayerNameGrid";
import UsernameTextField from "../../components/PlayerNameInput/PlayerNameInput";

export default function LobbyPage() {
  const { state, dispatch } = useLobby();
  const { socket } = useAuthenticatedSocket();
  const quizId = useLocation()?.state?.quizId;
  const { lobbyCode } = useParams();

  const { sendMessage: joinLobby } = useSocketEvent(socket, "lobby:join");
  const { lastMessage: createResponse, sendMessage: createLobby } =
    useSocketEvent(socket, "lobby:create");

  // create lobby is quizId is provided
  useEffect(() => {
    if (!socket.connected) return;

    if (quizId && state.lobbyCode === null) {
      console.log("Creating lobby", quizId);
      createLobby(quizId);
    }
  }, [socket.connected]); // eslint-disable-line react-hooks/exhaustive-deps

  // handle create response
  useEffect(() => {
    if (createResponse) {
      dispatch({
        type: LobbyActionType.JOIN_LOBBY,
        role: GameRole.HOST,
        lobbyCode: createResponse,
      });
    }
  }, [createResponse]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const quizName = "Quiz Lobby";

  return (
    <div className="lobbyPage" style={svgStyle}>
      <div>
        <div className="header">
          <h1 className="lobbyTitle">{quizName}</h1>
          {state.role === GameRole.HOST && <StartGameBtn />}
          {state.role !== null && (
            <PlayerCounter playerCount={state.players.length}></PlayerCounter>
          )}
        </div>
        <h1 className="lobbyCodeTitle">
          Game Pin: {state.lobbyCode ?? lobbyCode}
        </h1>
      </div>
      {state.role !== null ? (
        <div>
          {state.role === GameRole.HOST &&
            (state.players.length === 0 ? (
              <h1 style={{ color: "white" }}>Waiting for players...</h1>
            ) : (
              <PlayerNameGrid players={state.players}></PlayerNameGrid>
            ))}
          {state.role === GameRole.PLAYER && (
            <h1 style={{ color: "white" }}>Waiting for game to start...</h1>
          )}
        </div>
      ) : (
        <UsernameTextField
          className="playerNameInput"
          onSubmitted={(userName) => joinLobby({ lobbyCode, userName })}
        ></UsernameTextField>
      )}
    </div>
  );
}
