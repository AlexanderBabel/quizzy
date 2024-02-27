// import background from '../../images/blob-scene-haikei-2.svg';
import "./CreateQuestion.css";
import TextField from "@mui/material/TextField";
import React from "react";
import { Checkbox } from "@mui/material";

export default function CreateQuestion({ question, setQuestion }) {
  return (
    <div className="createQuestionPage">
      <div className="titleDiv">
        <TextField
          label="Question Title"
          variant="standard"
          fullWidth
          multiline
          inputProps={{ style: { fontSize: 25, color: "white" } }}
          value={question?.question || ""}
          onChange={(e) =>
            setQuestion({
              ...question,
              question: e.target.value,
            })
          }
        />
      </div>
      <div className="answers">
        {question?.answers?.map((answer, index) => (
          <div key={index} className="answerCard">
            <div>
              <Checkbox
                className="radioAnswer"
                checked={answer.correct || false}
                onChange={(e) => {
                  setQuestion({
                    ...question,
                    answers: question.answers.map((item, i) =>
                      i === index
                        ? { ...item, correct: e.target.checked }
                        : item
                    ),
                  });
                }}
              />
              <TextField
                label={`Answer ${index + 1}`}
                variant="standard"
                fullWidth
                multiline
                value={answer.text}
                onChange={(e) =>
                  setQuestion({
                    ...question,
                    answers: question.answers.map((item, i) =>
                      i === index ? { ...item, text: e.target.value } : item
                    ),
                  })
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
