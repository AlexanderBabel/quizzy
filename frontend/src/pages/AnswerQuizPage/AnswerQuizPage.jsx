import "./AnswerQuizPage.css";
import background from "../../images/blob-scene-haikei-8.svg";
import React from "react";
import AnswerQuizQuestion from "../../components/AnswerQuizQuestion/AnswerQuizQuestion";
import useLobby, { GameRole } from "../../context/useLobby";
import { useNavigate, useParams } from "react-router-dom";

export default function AnswerQuizPage() {
  const { state } = useLobby();
  const navigate = useNavigate();
  const { lobbyCode } = useParams();
  // const { question } = useGame();
  // eslint-disable-next-line
  // const [quiz, setQuiz] = useState(dummyQuiz);
  // const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  // const [currentQuestion, setCurrentQuestion] = useState(
  //   quiz.quiz.questions[currentQuestionNumber - 1]
  // );
  // const [resetCounter, setResetCounter] = useState(false);
  // // eslint-disable-next-line
  // const [currentQuestionStats, setCurrentQuestionStats] = useState();

  // const pullData = (data) => {
  //   setCurrentQuestionStats(data);
  // };

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

  if (lobbyCode && !state.lobbyCode) {
    navigate(`/join/${lobbyCode}`);
    return (
      <div className="answerQuizPage" style={svgStyle}>
        Joining lobby
      </div>
    );
  }

  if (!lobbyCode && !state.lobbyCode) {
    console.log(state);
    navigate("/");
    return (
      <div className="answerQuizPage" style={svgStyle}>
        Not in a lobby
      </div>
    );
  }

  // function handleNextQuestion() {
  //   //change this so it directs to stats before new question pops up
  //   setCurrentQuestionNumber(currentQuestionNumber + 1);
  //   setCurrentQuestion(quiz.quiz.questions[currentQuestionNumber]);
  //   setResetCounter(true);
  // }

  return (
    <div className="answerQuizPage" style={svgStyle}>
      {state.role === GameRole.HOST && (
        <button className="nextQuestionBtn" onClick={() => {}}>
          Next Question
        </button>
      )}
      <AnswerQuizQuestion />
    </div>
  );
}
