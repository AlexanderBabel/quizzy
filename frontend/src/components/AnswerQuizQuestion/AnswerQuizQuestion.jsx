import "./AnswerQuizQuestion.css";
import React, { useState } from "react";
import swine from "../../images/Swine.png";
import mouse from "../../images/Mouse.png";
import frog from "../../images/Frog.png";
import sheep from "../../images/Sheep.png";
import { useSocketEvent } from "socket.io-react-hook";
import useAuthenticatedSocket from "../../context/useAuthenticatedSocket";
import useGame from "../../context/useGame";
import useLobby, { GameRole } from "../../context/useLobby";
import WaitingPage from "../../pages/WaitingPage/WaitingPage";
import TimeRemaining from '../../components/TimeRemaining/TimeRemaining';

function getCardStyle(index) {
  switch ((index + 1) ) {
    case 1:
      return {
        background: { backgroundColor: "#8ABBFE" },
        icon: frog,
      };
    case 2:
      return {
        background: { backgroundColor: "#FFFF71" },
        icon: sheep,
      };
    case 3:
      return {
        background: { backgroundColor: "#FB9D4A" },
        icon: mouse,
      };
    case 4:
      return {
        background: { backgroundColor: "#56E75B" },
        icon: swine,
      };
    default:
      return {
        background: { backgroundColor: "white" },
      };
  }
}

export default function AnswerQuizQuestion() {
  const { gameState } = useGame();
  const { lobbyState } = useLobby();
  const { socket } = useAuthenticatedSocket();
  const { sendMessage: answer } = useSocketEvent(socket, "game:answer");
  const [chosenAnswer, setChosenAnswer] = useState();

  if (!gameState.question || chosenAnswer) {
    return (
      <WaitingPage
        text={
          chosenAnswer
            ? "Waiting for other players to answer..."
            : "Loading question..."
        }
      />
    );
  }

  // TODO: Add countdown and progress bar for the host
  return (
    <div className="AnswerQuestion" id='answerPage'>
      <h1>{gameState.question.question}</h1>
      <div className="answers" id='answerPageAnswers'>
        {gameState.question.answers.map(({ id, text }, index) => {
          const { background, icon } = getCardStyle(index);
          const cardStyle = {
            ...background,
            outline: chosenAnswer === id && "4px solid red",
          };
          return (
          
              <div
              id='answerPageAnswerCard'
                className="answerCard"
                style={cardStyle}
                onClick={() => {
                  if (chosenAnswer || lobbyState.role !== GameRole.PLAYER)
                    return;
                  answer(id);
                  setChosenAnswer(id);
                }}
              >
                <img src={icon} alt="icon" className="answerCardIcon" />
                <h4>{text}</h4>
              </div>
      
          );
        })}
      </div>
      <div>
        <TimeRemaining endTime={gameState.question.endTime} />
      </div>
    </div>
  );
}
