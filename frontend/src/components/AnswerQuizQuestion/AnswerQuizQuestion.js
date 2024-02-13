import './AnswerQuizQuestion.css';
import React, { useEffect, useState } from 'react';
import swine from '../../images/Swine.png';
import mouse from '../../images/Mouse.png';
import frog from '../../images/Frog.png';
import sheep from '../../images/Sheep.png';



const AnswerQuizQuestion = (props) => {
  const [counter, setCounter] = useState(30);
  const [chosenAnswer, setChosenAnswer] = useState()
  const [timeAnswered, setTimeAnswered] = useState(0)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if(props.resetCounterProp === true){
        props.setResetCounterProp(false)
        setCounter(30)
    }
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [counter, props.resetCounterProp]);


  useEffect(() => { 
    props.func(score);
    // eslint-disable-next-line
  }, [score]);



  useEffect(() => {
    let scoreTmp = 0
    if(chosenAnswer?.correct === true){
        scoreTmp = 300
        scoreTmp = scoreTmp - timeAnswered * 5
    }
    else{
        scoreTmp = 0
    }
    setScore(scoreTmp)
  }, [timeAnswered, chosenAnswer])

  const handleChooseAnswer = (answer) => {
    if (counter > 0){
        setChosenAnswer(answer)
        setTimeAnswered(30 - counter)

    }
  }

  
  return (
    <div className='AnswerQuestion'>
      <h1>{props.question.question}</h1>
      <h2> 00:{counter < 10 ? `0${counter}` : counter} </h2>
      <div className='answers'>
        {props.question.answers.map((answer, index) => {
          const answerNumber = index + 1;
          let background;
          let icon;
          switch (answerNumber) {
            case 1:
              background = { backgroundColor: '#8ABBFE' };
              icon = frog
              break;
            case 2:
              background = { backgroundColor: '#FFFF71' };
              icon = sheep
              break;
            case 3:
              background = { backgroundColor: '#FB9D4A' };
              icon = mouse
              break;
            case 4:
              background = { backgroundColor: '#56E75B' };
              icon = swine
              break;
            default:
              background = { backgroundColor: 'white' };
          } 
          const cardStyle = {
                ...background,
                outline: chosenAnswer === answer && '4px solid red' ,
              };
          return (
            <div className='overlayTest'>

            <div className='answerCard' style={cardStyle} onClick={() => handleChooseAnswer(answer)}>
                <img src={icon} alt='icon' className='answerCardIcon'/>
              <h4>
                {answer.text} {answerNumber}
              </h4>
            </div>
            </div>

          );
        })}
      </div>
    </div>
  );
};

export default AnswerQuizQuestion;
