import background from "../../images/blob-scene-haikei-8.svg";
import PlayerScore from "../../components/PlayerScore/PlayerScore";
import "./QuestionStats.css";
import ChosenAnswers from "../../components/ChosenAnswers/ChosenAnswers";
import useGame, { GameState } from "../../context/useGame";
import useLobby, { GameRole, LobbyActionType } from "../../context/useLobby";
import { useSocketEvent } from "socket.io-react-hook";
import useAuthenticatedSocket from "../../context/useAuthenticatedSocket";
import { useEffect } from "react";
import { useBlocker, useNavigate } from "react-router-dom";
import { PiSmileySad, PiSmiley } from "react-icons/pi";
import { IoIosFlash } from "react-icons/io";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { enqueueSnackbar } from "notistack";

export default function QuestionStats() {
  const { lobbyState, dispatch } = useLobby();
  const { gameState } = useGame();
  const navigate = useNavigate();
  const { socket } = useAuthenticatedSocket();
  const { sendMessage: leaveLobby } = useSocketEvent(socket, "lobby:leave");
  const { sendMessage: nextQuestion } = useSocketEvent(
    socket,
    "game:nextQuestion"
  );

  const blocker = useBlocker(
    ({ nextLocation }) =>
      nextLocation.pathname !== "/game" &&
      nextLocation.pathname !== "/game/results" &&
      !(
        !gameState.question &&
        !gameState.results &&
        nextLocation.pathname === "/"
      )
  );

  const svgStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    width: "100vw",
    height: "100vh",
    minHeight: "100vh",
    margin: 0,
    padding: 0,
  };

  useEffect(() => {
    if (gameState.state === GameState.QUESTION) {
      navigate("/game");
    } else if (gameState.state === GameState.END_GAME) {
      navigate("/game/results");
    }
  }, [gameState.state]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!gameState.question && !gameState.results) {
    navigate("/");
    return (
      <div className="answerQuizPage" style={svgStyle}>
        Not in a lobby
      </div>
    );
  }

  return (
    <div className="questionStatsPage" style={svgStyle}>
      <div className="questionStatsTop">
        <h1>{gameState?.question?.question}</h1>
        {lobbyState?.role === GameRole.HOST && (
          <button
            className="nextBtn"
            onClick={() => {
              nextQuestion();
              if (gameState?.results.gameOver) {
                navigate("/game/results");
              }
            }}
          >
            {gameState?.results?.gameOver ? "Show Results" : "Next Question"}
          </button>
        )}
      </div>

      {lobbyState?.role === GameRole.HOST && (
        <div className="questionStatsFigures">
          <div className="playerStatsSection">
            {gameState?.results?.scores?.slice(0, 5).map(({ name, score }) => (
              <PlayerScore playerName={name} playerScore={score} />
            ))}
          </div>
          <div>
            <ChosenAnswers />
          </div>
        </div>
      )}
      {lobbyState?.role === GameRole.PLAYER && (
        <div id="playerQuestionStatDiv">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div id="playerScore">
              <p>Score: {gameState?.results?.score}</p>
            </div>
            <div id="gainedThisRound">
              <IoIosFlash size={"20px"} />
              <p>Gained this round: {gameState?.results?.delta}</p>
            </div>
          </div>

          <div>
            {gameState?.results?.correct ? (
              <PiSmiley size={"150px"} style={{ color: "#1ac728" }} />
            ) : (
              <PiSmileySad size={"150px"} style={{ color: "red" }} />
            )}

            <h1
              style={
                gameState?.results?.correct
                  ? { color: "#1ac728" }
                  : { color: "red" }
              }
            >
              {gameState?.results?.correct
                ? "Correct Answer!"
                : "Incorrect Answer"}
            </h1>
          </div>

          <p>Waiting for host to continue...</p>
        </div>
      )}

      <Dialog
        open={blocker.state === "blocked"}
        onClose={() => blocker.reset()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to leave the current Game?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => blocker.reset()}>Stay</Button>
          <Button
            onClick={() => {
              leaveLobby();
              dispatch({ type: LobbyActionType.LEAVE_LOBBY });
              enqueueSnackbar("Game left!", { variant: "info" });
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
