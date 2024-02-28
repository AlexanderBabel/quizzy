import "./CardStartPage.css";
import { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { CiPlay1 } from "react-icons/ci";
import useToken from "../../context/useToken";
import useAxios from "axios-hooks";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

export default function CardStartPage({
  text,
  inputBool,
  quizCard,
  onclick,
  quiz,
  setUpdate,
  deleteAllowed,
}) {
  const [{ data, error }, deleteQuiz] = useAxios(
    {
      url: `quiz/${quiz?.quizId}/delete`,
      method: "delete",
    },
    { manual: true }
  );
  const [hoveredQuizCard, setHoveredQuizCard] = useState(false);
  const [lobbyCode, setLobbyCode] = useState();
  const { isCreator } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setUpdate(true);
      enqueueSnackbar(`Quiz "${quiz.name}" deleted`, {
        variant: "success",
      });
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (error) {
      enqueueSnackbar(`Failed to delete quiz. Error: ${error.message}`, {
        variant: "error",
      });
    }
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={quizCard ? "cardStartPageWrapper" : "cardStartPageWrapper"}
      onClick={onclick}
      onMouseEnter={() => setHoveredQuizCard(true)}
      onMouseLeave={() => setHoveredQuizCard(false)}
    >
      {quizCard && hoveredQuizCard && (
        <div className="quizCardBtns">
          {isCreator && deleteAllowed && (
            <>
              <button className="iconBtn">
                <MdOutlineEdit />
              </button>
              <button className="iconBtn" onClick={() => deleteQuiz()}>
                <FaTrash />
              </button>
            </>
          )}

          <button
            className="iconBtn"
            onClick={() =>
              navigate("/LobbyPage", { state: { quizId: quiz.quizId } })
            }
          >
            <CiPlay1 />
          </button>
        </div>
      )}

      <p>{quizCard ? quiz.name : text}</p>

      {inputBool && (
        <form
          onSubmit={() =>
            navigate("/LobbyPlayer", {
              state: { playerJoinLobbyId: lobbyCode },
            })
          }
        >
          <input
            className="inputPin"
            type="text"
            placeholder="Game PIN"
            onChange={(e) => setLobbyCode(e.target.value)}
            value={lobbyCode}
          />
        </form>
      )}
    </div>
  );
}
