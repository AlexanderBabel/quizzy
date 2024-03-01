import "./AnswerQuizPage.css";
import background from "../../images/blob-scene-haikei-8.svg";
import React, { useEffect } from "react";
import AnswerQuizQuestion from "../../components/AnswerQuizQuestion/AnswerQuizQuestion";
import useLobby from "../../context/useLobby";
import { useNavigate, useParams } from "react-router-dom";
import useGame from "../../context/useGame";

export default function AnswerQuizPage() {
  const { lobbyState } = useLobby();
  const { gameState } = useGame();
  const navigate = useNavigate();
  const { lobbyCode } = useParams();

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
    if (gameState.results) {
      navigate("/game/stats");
    }
  }, [gameState.results]); // eslint-disable-line react-hooks/exhaustive-deps

  if (lobbyCode && !lobbyState.lobbyCode) {
    navigate(`/join/${lobbyCode}`);
    return (
      <div className="answerQuizPage" style={svgStyle}>
        Joining lobby
      </div>
    );
  }

  if (!lobbyCode && !lobbyState.lobbyCode) {
    navigate("/");
    return (
      <div className="answerQuizPage" style={svgStyle}>
        Not in a lobby
      </div>
    );
  }

  return (
    <div className="answerQuizPage" style={svgStyle}>
      <AnswerQuizQuestion />
    </div>
  );
}
