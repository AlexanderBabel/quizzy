import './AnswerQuizPage.css';
import background from '../../images/blob-scene-haikei-8.svg';
import React, { useState } from 'react';
import dummyQuiz from './dummyQuiz.json'
import AnswerQuizQuestion from '../../components/AnswerQuizQuestion/AnswerQuizQuestion';

function AnswerQuizPage() {
  // eslint-disable-next-line
  const [quiz, setQuiz] = useState(dummyQuiz)
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
  const [currentQuestion, setCurrentQuestion] = useState(quiz.quiz.questions[currentQuestionNumber - 1])
  const [resetCounter, setResetCounter] = useState(false)
  // eslint-disable-next-line
  const [currentQuestionStats, setCurrentQuestionStats] = useState()

  const pullData = (data) => {
    setCurrentQuestionStats(data);
  };

  const svgStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    width: '100%',
    height: '100%',
    minHeight: '100vh',
    margin: 0,
    padding: 0,
  };

  function handleNextQuestion() { //change this so it directs to stats before new question pops up
    setCurrentQuestionNumber(currentQuestionNumber + 1)
    setCurrentQuestion(quiz.quiz.questions[currentQuestionNumber])
    setResetCounter(true)

  }

  return <div className='answerQuizPage' style={svgStyle}>
    <button className='nextQuestionBtn' onClick={handleNextQuestion}>Next Question</button>
    <AnswerQuizQuestion func={pullData} question={currentQuestion} resetCounterProp={resetCounter} setResetCounterProp={setResetCounter} />
  </div>;
}

export default AnswerQuizPage;
