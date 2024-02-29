import background from "../../images/blob-scene-haikei-8.svg";
import PlayerScore from "../../components/PlayerScore/PlayerScore";
import "./QuestionStats.css";
import ChosenAnswers from "../../components/ChosenAnswers/ChosenAnswers";
import useGame from "../../context/useGame";
import useLobby, { GameRole } from "../../context/useLobby";
import { useSocketEvent } from "socket.io-react-hook";
import useAuthenticatedSocket from "../../context/useAuthenticatedSocket";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function QuestionStats() {
  const { state: lobbyState } = useLobby();
  const { state: gameState } = useGame();
  const navigate = useNavigate();
  const { socket } = useAuthenticatedSocket();
  const { sendMessage: nextQuestion } = useSocketEvent(
    socket,
    "game:nextQuestion"
  );

  const svgStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    width: "100%",
    height: "100%",
    minHeight: "100vh",
    margin: 0,
    padding: 0,
  };

  useEffect(() => {
    if (gameState.question && !gameState.results) {
      navigate("/game");
    }
  }, [gameState.question, gameState.results]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="questionStatsPage" style={svgStyle}>
      <div className="questionStatsTop">
        <h1>{gameState?.question?.question}</h1>
        {lobbyState?.role === GameRole.HOST && (
          <button
            className="nextBtn"
            onClick={() => {
              if (gameState?.results.gameOver) {
                navigate("/game/results");
                return;
              }

              nextQuestion();
            }}
          >
            Next
          </button>
        )}
      </div>

      {lobbyState?.role === GameRole.HOST && (
        <div className="questionStatsFigures">
          <div className="playerStatsSection">
            {gameState?.results?.scores?.map(({ name, score }) => (
              <PlayerScore playerName={name} playerScore={score} />
            ))}
          </div>
          <div>
            <ChosenAnswers />
          </div>
        </div>
      )}
      {lobbyState?.role === GameRole.PLAYER && (
        // TODO: implement player view
        <div>Waiting for host to continue...</div>
      )}
    </div>
  );
}
