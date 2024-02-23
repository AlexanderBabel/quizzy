import './CreateQuizPage.css';
import background from '../../images/blob-scene-haikei-16.svg';
import miniQuestion from '../../images/miniQuestion.png';
import React, { useState, useEffect } from 'react';
import CreateQuestion from '../../components/CreateQuestion/CreateQuestion';
import { FaTrash } from 'react-icons/fa';
import TextField from '@mui/material/TextField';
import useToken from '../../components/useToken/useToken';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function CreateQuizPage() {
  const navigate = useNavigate();
  // eslint-disable-next-line
  const { token, setToken } = useToken(); 
  const [quizTitle, setQuizTitle] = useState(
    window.sessionStorage.getItem('sessionQuizTitle') || ''
  );
  const [numQuestions, setNumQuestions] = useState(
    window.sessionStorage.getItem('sessionNumQuestions') || 1
  );
  const [activeMiniature, setActiveMiniature] = useState(1);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [currentQuestionEdit, setCurrentQuestionEdit] = useState(
    JSON.parse(window.sessionStorage.getItem('sessionCurrentQuestionEdit')) || {
      questionTitle: '',
      answer1: '',
      answer2: '',
      answer3: '',
      answer4: '',
      correct: 'null',
      order: numQuestions,
    }
  );
  const [allQuestions, setAllQuestions] = useState(
    JSON.parse(window.sessionStorage.getItem('sessionAllQuestions')) || [
      { order: numQuestions, question: currentQuestionEdit },
    ]
  );

  const pull_data = (data) => {
    setCurrentQuestionEdit(data);
  };

  const addQuestion = () => {
    const newQuestion = {
      questionTitle: '',
      answer1: '',
      answer2: '',
      answer3: '',
      answer4: '',
      correct: 'null',
      order: parseInt(numQuestions) + 1,
    };
    setCurrentQuestionEdit(newQuestion);
    setAllQuestions([
      ...allQuestions,
      { order: parseInt(numQuestions) + 1, question: newQuestion },
    ]);
    setNumQuestions(parseInt(numQuestions) + 1);
  };

 function changeOrders(arr) {
    const upd = arr.map((item, index) => ({
      ...item,
      order: index + 1,
      question: {
        ...item.question,
        order: index + 1,
      },
    }));
    return upd;
  }

  const deleteQuestion = () => {
    const questionToDelete = currentQuestionEdit;
    const updatedQuestions = allQuestions.filter(
      (question) => question.order !== questionToDelete.order
    );
    const changedOrders = changeOrders(updatedQuestions);
    setAllQuestions(changedOrders);
    setNumQuestions(numQuestions - 1);
    setDeleteInProgress(true);
  };

 

  useEffect(() => {
    if (deleteInProgress) {
      if (allQuestions.length === 0) {
        addQuestion();
      } else if (allQuestions.length > 0) {
        if (currentQuestionEdit.order > 1) {
          const newCurrentQuestion = allQuestions.find(
            (question) => question.order === currentQuestionEdit.order - 1
          );
          setCurrentQuestionEdit(newCurrentQuestion.question);
        } else if (currentQuestionEdit.order === 1) {
          const newCurrentQuestion = allQuestions.find(
            (question) => question.order === currentQuestionEdit.order
          );
          setCurrentQuestionEdit(newCurrentQuestion.question);
        }
      }
    }
    setDeleteInProgress(false);
  }, [allQuestions]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setAllQuestions((prevQuestions) => {
      if(prevQuestions){
      const updatedQuestions = prevQuestions.map((question) => {
        if (question.order !== currentQuestionEdit.order) {
          return question;
        } else {
          return {
            ...question,
            question: currentQuestionEdit,
          };
        }
      });

      return updatedQuestions;
      }
    });
    setActiveMiniature(currentQuestionEdit.order);
  }, [currentQuestionEdit]);

  const svgStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
  };

  const activeMiniatureStyle = {
    border: '2px solid #A86EFF',
  };

  function format() {
    const quiz = {
      name: quizTitle,
      visibility: 'PUBLIC',
      questions: allQuestions.map((item) => ({
        order: item.order,
        question: item.question.questionTitle,
        answers: [
          {
            text: item.question.answer1,
            correct: item.question.correct === item.question.answer1,
          },
          {
            text: item.question.answer2,
            correct: item.question.correct === item.question.answer2,
          },
          {
            text: item.question.answer3,
            correct: item.question.correct === item.question.answer3,
          },
          {
            text: item.question.answer4,
            correct: item.question.correct === item.question.answer4,
          },
        ],
      })),
    };
    return quiz;
  }


  function createQuiz() {
    console.log(token)
    let config = {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
      const qz = format()
    
      axios.post('http://localhost:3001/v1/quiz/add', qz, config)
      .then(function (response) {
        sessionStorage.clear()
        navigate('/')
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  useEffect(() => {
    var sessionQuizTitle = window.sessionStorage.getItem('sessionQuizTitle');
    setQuizTitle(sessionQuizTitle);

    var sessionNumQuestions = window.sessionStorage.getItem(
      'sessionNumQuestions'
    );
    setNumQuestions(sessionNumQuestions);

    var sessionCurrentQuestionEdit = JSON.parse(
      window.sessionStorage.getItem('sessionCurrentQuestionEdit')
    );
    setCurrentQuestionEdit(sessionCurrentQuestionEdit);

    var sessionAllQuestions = JSON.parse(
      window.sessionStorage.getItem('sessionAllQuestions')
    );
    setAllQuestions(sessionAllQuestions);
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem('sessionQuizTitle', quizTitle);
  }, [quizTitle]);

  useEffect(() => {
    window.sessionStorage.setItem('sessionNumQuestions', numQuestions);
  }, [numQuestions]);

  useEffect(() => {
    window.sessionStorage.setItem(
      'sessionCurrentQuestionEdit',
      JSON.stringify(currentQuestionEdit)
    );
  }, [currentQuestionEdit]);

  useEffect(() => {
    window.sessionStorage.setItem(
      'sessionAllQuestions',
      JSON.stringify(allQuestions)
    );
  }, [allQuestions]);


  return (
    <div className='createQuizPage' style={svgStyle}>
      <div className='createQuizTop'>
        <div className='quizTitleDiv'>
          <TextField
            label='Quiz title'
            variant='standard'
            fullWidth
            multiline
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
          />
        </div>

        <button className='finishQuizBtn' onClick={createQuiz}>
          Finish Quiz
        </button>
      </div>

      <div className='createqtnandsidebar' >
        <div className='leftSidebar'>
          {allQuestions !== null && allQuestions.map((question) => {
            return (
              <div
                className='questionMiniatureWrapper'
                onClick={() => setCurrentQuestionEdit(question.question)}
              >
                <div className='numAndDelBtn'>
                  {question.order}
                  <button
                    style={
                      activeMiniature === question.order
                        ? { visibility: 'visible' }
                        : { visibility: 'hidden' }
                    }
                    className='deleteQuestionBtn'
                    onClick={deleteQuestion}
                  >
                    <FaTrash />
                  </button>
                </div>

                <img
                  style={
                    activeMiniature === question.order
                      ? activeMiniatureStyle
                      : {}
                  }
                  className='questionMiniature'
                  src={miniQuestion}
                  alt='miniQuestion'
                />
              </div>
            );
          })}
          <button className='addQuestionBtn' onClick={addQuestion}>
            +
          </button>
        </div>

        <div className='createQuestionDiv'>
          <CreateQuestion
            func={pull_data}
            quizQuestion={currentQuestionEdit}
            setQuizQuestion={setCurrentQuestionEdit}
          />
        </div>

      </div>
    </div>
  );
}

export default CreateQuizPage;
