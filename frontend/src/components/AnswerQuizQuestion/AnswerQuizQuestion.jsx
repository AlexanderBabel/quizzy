import "./AnswerQuizQuestion.css";
import React, { useState } from "react";
import swine from "../../images/Swine.png";
import mouse from "../../images/Mouse.png";
import frog from "../../images/Frog.png";
import sheep from "../../images/Sheep.png";
import { useSocketEvent } from "socket.io-react-hook";
import useAuthenticatedSocket from "../../context/useAuthenticatedSocket";
import useGame from "../../context/useGame";

function getCardStyle(index) {
  switch ((index + 1) % 4) {
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

export default function AnswerQuizQuestion(props) {
  const { state } = useGame();
  const { socket } = useAuthenticatedSocket();
  const { sendMessage: answer } = useSocketEvent(socket, "game:answer");
  const [chosenAnswer, setChosenAnswer] = useState();

  if (!state.question) return <div>Loading...</div>;

  // TODO: Add countdown and progress bar for the host
  // TODO: show loading animation to the player after they answer
  // TODO: make cards only clickable for the player
  return (
    <div className="AnswerQuestion">
      <h1>{state.question.question}</h1>
      {/* <h2> 00:{counter < 10 ? `0${counter}` : counter} </h2> */}
      <div className="answers">
        {state.question.answers.map(({ id, text }, index) => {
          const { background, icon } = getCardStyle(index);
          const cardStyle = {
            ...background,
            outline: chosenAnswer === id && "4px solid red",
          };
          return (
            <div key={index} className="overlayTest">
              <div
                className="answerCard"
                style={cardStyle}
                onClick={() => {
                  if (chosenAnswer) return;
                  answer(id);
                  setChosenAnswer(id);
                }}
              >
                <img src={icon} alt="icon" className="answerCardIcon" />
                <h4>{text}</h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
