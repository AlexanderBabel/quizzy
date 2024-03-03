import "./LobbyPage.css";
import background from "./../../images/blob-scene-haikei-2.svg";
import StartGameBtn from "../../components/Buttons/StartGameBtn";
import PlayerCounter from "../../components/PlayerCounter/PlayerCounter";
import { useEffect } from "react";
import {
  useBlocker,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useSocketEvent } from "socket.io-react-hook";
import useAuthenticatedSocket from "../../context/useAuthenticatedSocket";
import useLobby, { GameRole, LobbyActionType } from "../../context/useLobby";
import PlayerNameGrid from "../../components/PlayerNameGrid/PlayerNameGrid";
import UsernameTextField from "../../components/PlayerNameInput/PlayerNameInput";
import { enqueueSnackbar } from "notistack";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import WaitingPage from "../WaitingPage/WaitingPage";
import QrGenerator from '../../components/Util/QrGenerator';


export default function LobbyPage() {
  const navigate = useNavigate();
  const { lobbyState, dispatch } = useLobby();
  const { socket } = useAuthenticatedSocket();
  const quizId = useLocation()?.state?.quizId;
  const { lobbyCode } = useParams();

  const { lastMessage: joinLobbyResponse, sendMessage: joinLobby } =
    useSocketEvent(socket, "lobby:join");
  const { lastMessage: createResponse, sendMessage: createLobby } =
    useSocketEvent(socket, "lobby:create");
  const { lastMessage: startGameResponse, sendMessage: startQuiz } =
    useSocketEvent(socket, "lobby:start");
  const { sendMessage: leaveLobby } = useSocketEvent(socket, "lobby:leave");

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      currentLocation.pathname !== nextLocation.pathname &&
      nextLocation.pathname !== "/game" &&
      !nextLocation.pathname.startsWith("/join")
  );

  // create lobby is quizId is provided
  useEffect(() => {
    if (!socket.connected) return;

    if (quizId && lobbyState.lobbyCode === null) {
      createLobby(quizId);
    } else if (lobbyCode && lobbyState.lobbyCode === null) {
      joinLobby({ lobbyCode });
    }
  }, [socket.connected]); // eslint-disable-line react-hooks/exhaustive-deps

  // handle create response
  useEffect(() => {
    if (createResponse?.lobbyCode) {
      navigate(`/join/${createResponse?.lobbyCode}`, {
        replace: true,
        state: { quizId },
      });
      enqueueSnackbar("Lobby created!", { variant: "success" });
      dispatch({
        type: LobbyActionType.JOIN_LOBBY,
        role: GameRole.HOST,
        lobbyCode: createResponse.lobbyCode,
        quizName: createResponse.quizName,
      });
    }
  }, [createResponse]); // eslint-disable-line react-hooks/exhaustive-deps

  // handle quiz start response
  useEffect(() => {
    if (startGameResponse) {
      navigate("/game");
      enqueueSnackbar("Game started!", { variant: "success" });
      return;
    }
  }, [startGameResponse]); // eslint-disable-line react-hooks/exhaustive-deps

  // handle join lobby response
  useEffect(() => {
    if (joinLobbyResponse?.state === "game") {
      navigate("/game");
      enqueueSnackbar(
        "Game is already running. Continuing with next question...",
        { variant: "info" }
      );
      dispatch({
        type: LobbyActionType.JOIN_LOBBY,
        role: joinLobbyResponse.role ?? GameRole.PLAYER,
        quizName: joinLobbyResponse.quizName,
        lobbyCode,
      });
    }

    if (joinLobbyResponse?.state === "lobby") {
      enqueueSnackbar("Lobby joined!", {
        variant: "success",
      });
      navigate(`/join/${lobbyCode}`, { replace: true, state: { quizId } });
      dispatch({
        type: LobbyActionType.JOIN_LOBBY,
        role: joinLobbyResponse.role ?? GameRole.PLAYER,
        quizName: joinLobbyResponse.quizName,
        lobbyCode,
      });
    }
  }, [joinLobbyResponse]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Show loading screen if a quizId was passed
  if (!createResponse && quizId && lobbyState.lobbyCode === null) {
    return <WaitingPage text={"Creating lobby..."} />;
  }

  return (
    <div className="lobbyPage" style={svgStyle}>
      <div className="lobbyPageTop">
        <h1 className="lobbyTitle">{lobbyState.quizName ?? "Quiz Lobby"}</h1>
        <div className="lobbyBtns">
          {lobbyState.role !== null && (
            <PlayerCounter
              playerCount={lobbyState.players.length}
            ></PlayerCounter>
          )}
          {lobbyState.role === GameRole.HOST &&
            lobbyState.players?.length > 0 && (
              <StartGameBtn text="Start Game" onClick={() => startQuiz()} />
            )}
        </div>
        <h1 className="lobbyCodeTitle">
          Game Pin: {lobbyState.lobbyCode ?? lobbyCode}
        </h1>
        <div>
        <QrGenerator lobbyCode={lobbyState.lobbyCode} size={250} />
        </div>
      </div>

      {lobbyState.role !== null ? (
        <>
          {lobbyState.role === GameRole.HOST &&
            (lobbyState.players.length === 0 ? (
              <div className="lobbyPageBottom">
                <h1>Waiting for players...</h1>
              </div>
            ) : (
              <div className="playerNameGridDiv">
                <PlayerNameGrid players={lobbyState.players}></PlayerNameGrid>
              </div>
            ))}
          {lobbyState.role === GameRole.PLAYER && (
            <>
              <div className="lobbyPageBottom">
                <h1>Waiting for game to start...</h1>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="lobbyPageBottom">
          <UsernameTextField
            className="playerNameInput"
            onSubmitted={(userName) => joinLobby({ lobbyCode, userName })}
          ></UsernameTextField>
        </div>
      )}

      <Dialog
        open={blocker.state === "blocked"}
        onClose={() => blocker.reset()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to leave the current Lobby?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => blocker.reset()}>Stay</Button>
          <Button
            onClick={() => {
              leaveLobby();
              dispatch({ type: LobbyActionType.LEAVE_LOBBY });
              enqueueSnackbar("Lobby left!", { variant: "info" });
              blocker.proceed();
            }}
            autoFocus
          >
            Leave
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
