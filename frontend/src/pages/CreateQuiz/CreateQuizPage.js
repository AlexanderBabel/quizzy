import './CreateQuizPage.css';
import background from '../../images/blob-scene-haikei-2.svg';
import miniQuestion from '../../images/miniQuestion.png';
import React, { useState, useEffect } from 'react';
import CreateQuestion from '../../components/CreateQuestion/CreateQuestion';
import { FaTrash } from 'react-icons/fa';

function CreateQuizPage() {
  const [numQuestions, setNumQuestions] = useState(1);
  const [activeMiniature, setActiveMiniature] = useState(1);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [currentQuestionEdit, setCurrentQuestionEdit] = useState({
    questionTitle: '',
    answer1: '',
    answer2: '',
    answer3: '',
    answer4: '',
    correct: 'null',
    order: numQuestions,
  });
  const [allQuestions, setAllQuestions] = useState([
    { order: numQuestions, question: currentQuestionEdit },
  ]);

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
      order: numQuestions + 1,
    };
    setCurrentQuestionEdit(newQuestion);
    setAllQuestions([
      ...allQuestions,
      { order: numQuestions + 1, question: newQuestion },
    ]);
    setNumQuestions(numQuestions + 1);
  };

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

  useEffect(() => {
    if (deleteInProgress) {
      if (allQuestions.length == 0) {
        addQuestion();
      } else if (allQuestions.length > 0) {
        if (currentQuestionEdit.order > 1) {
          const newCurrentQuestion = allQuestions.find(
            (question) => question.order === currentQuestionEdit.order - 1
          );
          setCurrentQuestionEdit(newCurrentQuestion.question);
        } else if (currentQuestionEdit.order == 1) {
          const newCurrentQuestion = allQuestions.find(
            (question) => question.order === currentQuestionEdit.order
          );
          setCurrentQuestionEdit(newCurrentQuestion.question);
        }
      }
    }
    setDeleteInProgress(false);
  }, [allQuestions]);
 
  useEffect(() => {
    setAllQuestions((prevQuestions) => {
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

  return (
    <div className='createQuizPage' style={svgStyle}>
      <div className='leftSidebar'>
        {allQuestions?.map((question) => {
          return (
            <div
              className='questionMiniatureWrapper'
              onClick={() => setCurrentQuestionEdit(question.question)}
            >
            <div className='numAndDelBtn'>
                 {question.order} 
              <button
                style={
                  activeMiniature == question.order
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
                  activeMiniature == question.order ? activeMiniatureStyle : {}
                }
                className='questionMiniature'
                src={miniQuestion}
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
      <div className='finishQuiz'>
      <button className='finishQuizBtn' >
          Finish Quiz
        </button>
      </div>
    </div>
  );
}

export default CreateQuizPage;