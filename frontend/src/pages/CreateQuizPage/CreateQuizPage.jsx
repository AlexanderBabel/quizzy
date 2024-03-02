import "./CreateQuizPage.css";
import background from "../../images/blob-scene-haikei-16.svg";
import miniQuestion from "../../images/miniQuestion.png";
import React, { useEffect } from "react";
import CreateQuestion from "../../components/CreateQuestion/CreateQuestion";
import { FaTrash } from "react-icons/fa";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import useToken from "../../context/useToken";
import useAxios from "axios-hooks";
import { useSnackbar } from "notistack";

const Type = {
  SWITCH_QUESTION: "SWITCH_QUESTION",
  UPDATE_TITLE: "UPDATE_TITLE",
  UPDATE_CURRENT_QUESTION: "UPDATE_CURRENT_QUESTION",
  DELETE_QUESTION: "DELETE_QUESTION",
  ADD_QUESTION: "ADD_QUESTION",
  EXAMPLE_QUESTIONS: "EXAMPLE_QUESTIONS",
};

const TEST_QUESTIONS = [
  {
    question: "What is the largest cathedral in Sweden?",
    answers: [
      { text: "Storkyrkan", correct: false },
      { text: "Lund Cathedral", correct: false },
      { text: "Uppsala Cathedral", correct: true },
      { text: "Gothenburg Cathedral", correct: false },
    ],
  },
  {
    question: "Which two innovations is Sweden known for?",
    answers: [
      { text: "Bluetooth Technology", correct: true },
      { text: "Electric Cars", correct: false },
      { text: "Flat-pack Furniture", correct: true },
      { text: "Digital Currency", correct: false },
    ],
  },
  {
    question: "Which river runs through Uppsala?",
    answers: [
      { text: "River Thames", correct: false },
      { text: "River Seine", correct: false },
      { text: "River Danube", correct: false },
      { text: "River Fyris", correct: true },
    ],
  },
  {
    question:
      "Which Swedish city was originally founded under the name 'Aros' near the end of the Viking Age?",
    answers: [
      { text: "Stockholm", correct: false },
      { text: "Gothenburg", correct: false },
      { text: "Visby", correct: false },
      { text: "Uppsala", correct: true },
    ],
  },
  {
    question: "What are two major exports of Sweden?",
    answers: [
      { text: "Iron Ore", correct: true },
      { text: "Wheat", correct: false },
      { text: "Machinery and Automobiles", correct: true },
      { text: "Cocoa Beans", correct: false },
    ],
  },
];

function reducer(state, action) {
  const newState = { ...state };

  switch (action.type) {
    case Type.UPDATE_TITLE:
      newState.title = action.title;
      break;
    case Type.SWITCH_QUESTION:
      newState.questionIndex = action.questionIndex;
      break;
    case Type.UPDATE_CURRENT_QUESTION:
      newState.questions = newState.questions.map((question, index) => {
        if (index === state.questionIndex) {
          return action.question;
        }
        return question;
      });
      break;
    case Type.DELETE_QUESTION:
      newState.questions = newState.questions.filter(
        (_, index) => index !== action.questionIndex
      );
      newState.questionIndex = Math.max(0, newState.questionIndex - 1);
      break;
    case Type.ADD_QUESTION:
      const question = {
        question: "",
        answers: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
      };
      newState.questions = [...newState.questions, question];
      newState.questionIndex = newState.questions.length - 1;
      break;
    case Type.EXAMPLE_QUESTIONS:
      newState.title = "Trivia about Uppsala and Sweden";
      newState.questions = TEST_QUESTIONS;

      newState.questionIndex = 0;
      break;
    default:
      break;
  }

  localStorage.setItem("createQuiz", JSON.stringify(newState));
  return newState;
}

export default function CreateQuizPage() {
  const { isCreator } = useToken();
  const navigate = useNavigate();
  const [state, dispatch] = React.useReducer(
    reducer,
    {
      title: "",
      questionIndex: 0,
      questions: [],
    },
    () => {
      const createQuiz = JSON.parse(localStorage.getItem("createQuiz"));
      return {
        title: createQuiz?.title || "",
        questionIndex: createQuiz?.questionIndex || 0,
        questions: createQuiz?.questions || [
          {
            question: "",
            answers: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
          },
        ],
      };
    }
  );

  const { enqueueSnackbar } = useSnackbar();
  const [{ data, loading, error }, createQuiz] = useAxios(
    {
      url: "quiz/add",
      method: "post",
    },
    { manual: true }
  );

  const svgStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    width: "100%",
    height: "100%",
    margin: 0,
    padding: 0,
  };

  const activeMiniatureStyle = {
    border: "2px solid #A86EFF",
  };

  function format() {
    const quiz = {
      name: state.title,
      visibility: "PUBLIC",
      questions: state.questions.map((q, index) => ({
        order: index,
        question: q.question,
        answers: q.answers.map((a) => ({
          text: a.text,
          correct: a.correct || false,
        })),
      })),
    };
    return quiz;
  }

  useEffect(() => {
    if (!data) return;
    localStorage.removeItem("createQuiz");
    enqueueSnackbar("Quiz created successfully!", { variant: "success" });
    navigate("/");
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (error) {
      enqueueSnackbar(`Failed to create quiz ${error.message}`, {
        variant: "error",
      });
    }
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isCreator) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div className="createQuizPage" style={svgStyle}>
      <div className="createQuizTop">
        <div className="quizTitleDiv">
          <TextField
            label="Quiz title"
            variant="standard"
            fullWidth
            multiline
            value={state.title}
            onChange={(e) =>
              dispatch({ type: Type.UPDATE_TITLE, title: e.target.value })
            }
          />
        </div>

        <button
          className="finishQuizBtn"
          onClick={() => {
            createQuiz({ data: format() });
          }}
          disabled={loading || data}
        >
          Finish Quiz
        </button>
      </div>

      <div className="createqtnandsidebar">
        <div className="leftSidebar">
          {state.questions?.length >= 0 &&
            state.questions.map((question, index) => {
              return (
                <div key={index} className="questionMiniatureWrapper">
                  <div className="numAndDelBtn">
                    {question.order}
                    <button
                      style={
                        state.questionIndex === index
                          ? { visibility: "visible" }
                          : { visibility: "hidden" }
                      }
                      className="deleteQuestionBtn"
                      onClick={() =>
                        dispatch({
                          type: Type.DELETE_QUESTION,
                          questionIndex: index,
                        })
                      }
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <img
                    onClick={() =>
                      dispatch({
                        type: Type.SWITCH_QUESTION,
                        questionIndex: index,
                      })
                    }
                    style={
                      state.questionIndex === index ? activeMiniatureStyle : {}
                    }
                    className="questionMiniature"
                    src={miniQuestion}
                    alt="miniQuestion"
                  />
                </div>
              );
            })}
          <button
            className="addQuestionBtn"
            onClick={() => dispatch({ type: Type.ADD_QUESTION })}
          >
            +
          </button>
          {process.env.NODE_ENV === "development" && (
            <button onClick={() => dispatch({ type: Type.EXAMPLE_QUESTIONS })}>
              Create Test Questions
            </button>
          )}
        </div>
        <div className="createQuestionDiv">
          <CreateQuestion
            question={state.questions[state.questionIndex]}
            setQuestion={(question) => {
              dispatch({ type: Type.UPDATE_CURRENT_QUESTION, question });
            }}
          />
        </div>
      </div>
    </div>
  );
}
