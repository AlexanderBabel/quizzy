// import background from '../../images/blob-scene-haikei-2.svg';
import './CreateQuestion.css';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import React, { useEffect } from 'react';

const CreateQuestion = (props) => {

  useEffect(() => {
    props.func(props.quizQuestion);
  }, [props.quizQuestion, props.func]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleQuizAnswer(e, answerNumber) {
    props.setQuizQuestion({
      ...props.quizQuestion,
      [answerNumber]: e.target.value,
    });
  }

  function handleCorrectAnswer(e, answer) {
    if (props.quizQuestion[answer] !== '') {
      props.setQuizQuestion({
        ...props.quizQuestion,
        correct: e.target.value,
      });
    }
  }


  return (
    <div className='createQuestionPage'>
      <div className='titleDiv'>
        <TextField
          label='Question Title'
          variant='standard'
          fullWidth
          multiline
          inputProps={{ style: { fontSize: 30, color: 'white' } }}
          value={props.quizQuestion.questionTitle}
          onChange={(e) =>
            props.setQuizQuestion({
              ...props.quizQuestion,
              questionTitle: e.target.value,
            })
          }
        />
      </div>

      <div className='answers'>
        <div className='answerCard'>
          <Radio
            className='radioAnswer'
            checked={props.quizQuestion.correct === props.quizQuestion.answer1}
            onChange={(e) => handleCorrectAnswer(e, 'answer1')}
            value={props.quizQuestion.answer1}
            name='radio-buttons'
          />
          <TextField
            label='Answer 1'
            variant='standard'
            fullWidth
            multiline
            value={props.quizQuestion.answer1}
            onChange={(e) => handleQuizAnswer(e, 'answer1')}
          />
        </div>
        <div className='answerCard'>
          <Radio
            className='radioAnswer'
            checked={props.quizQuestion.correct === props.quizQuestion.answer2}
            onChange={(e) => handleCorrectAnswer(e, 'answer2')}
            value={props.quizQuestion.answer2}
            name='radio-buttons'
          />
          <TextField
            label='Answer 2'
            variant='standard'
            fullWidth
            multiline
            value={props.quizQuestion.answer2}
            onChange={(e) => handleQuizAnswer(e, 'answer2')}
          />
        </div>
        <div className='answerCard'>
          <Radio
            className='radioAnswer'
            checked={props.quizQuestion.correct === props.quizQuestion.answer3}
            onChange={(e) => handleCorrectAnswer(e, 'answer3')}
            value={props.quizQuestion.answer3}
            name='radio-buttons'
          />
          <TextField
            label='Answer 3'
            variant='standard'
            fullWidth
            multiline
            value={props.quizQuestion.answer3}
            onChange={(e) => handleQuizAnswer(e, 'answer3')}
          />
        </div>
        <div className='answerCard'>
          <Radio
            className='radioAnswer'
            checked={props.quizQuestion.correct === props.quizQuestion.answer4}
            onChange={(e) => handleCorrectAnswer(e, 'answer4')}
            value={props.quizQuestion.answer4}
            name='radio-buttons'
          />
          <TextField
            label='Answer 4'
            variant='standard'
            fullWidth
            multiline
            value={props.quizQuestion.answer4}
            onChange={(e) => handleQuizAnswer(e, 'answer4')}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateQuestion;
