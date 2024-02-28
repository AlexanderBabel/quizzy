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

  // const [counter, setCounter] = useState(30);
  // const [timeAnswered, setTimeAnswered] = useState(0);
  // const [score, setScore] = useState(0);

  // useEffect(() => {
  //   if (props.resetCounterProp === true) {
  //     props.setResetCounterProp(false);
  //     setCounter(30);
  //   }
  //   const timer =
  //     counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
  //   return () => clearInterval(timer);
  //   // eslint-disable-next-line
  // }, [counter, props.resetCounterProp]);

  // useEffect(() => {
  //   props.func(score);
  //   // eslint-disable-next-line
  // }, [score]);

  // useEffect(() => {
  //   let scoreTmp = 0;
  //   if (chosenAnswer?.correct === true) {
  //     scoreTmp = 300;
  //     scoreTmp = scoreTmp - timeAnswered * 5;
  //   } else {
  //     scoreTmp = 0;
  //   }
  //   setScore(scoreTmp);
  // }, [timeAnswered, chosenAnswer]);

  // const handleChooseAnswer = (answer) => {
  //   if (counter > 0) {
  //     setChosenAnswer(answer);
  //     setTimeAnswered(30 - counter);
  //   }
  // };

  if (!state.question) return <div>Loading...</div>;

  return (
    <div className="AnswerQuestion">
      <h1>{state.question.question}</h1>
      {/* <h2> 00:{counter < 10 ? `0${counter}` : counter} </h2> */}
      <div className="answers">
        {state.question.answers.map(({ answerId, text }, index) => {
          const { background, icon } = getCardStyle(index);
          const cardStyle = {
            ...background,
            outline: chosenAnswer === answerId && "4px solid red",
          };
          return (
            <div className="overlayTest">
              <div
                className="answerCard"
                style={cardStyle}
                onClick={() => {
                  if (chosenAnswer) return;
                  answer(answerId);
                  setChosenAnswer(answerId);
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
