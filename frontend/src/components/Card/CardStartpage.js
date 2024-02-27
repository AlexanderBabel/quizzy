import './CardStartpage.css';
import { useEffect, useState } from 'react';
import { MdOutlineEdit } from "react-icons/md";
import { FaTrash } from 'react-icons/fa';
import { CiPlay1 } from "react-icons/ci";
import useToken from '../useToken/useToken';
import useAxios from 'axios-hooks';

const CardStartpage = ({ text, inputBool, quizcard, onclick, quiz, setUpdate, deleteAllowed }) => {
  const [{ data }, deleteQuiz] = useAxios(`quiz/${quiz?.quizId}/delete`, { manual: true });
  const [hoveredQuizCard, setHoveredQuizCard] = useState(false);
  const { isCreator } = useToken();

  useEffect(() => {
    if (data) {
      setUpdate(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className={quizcard ? 'cardStartpageWrapper' : 'cardStartpageWrapper'}
      onClick={onclick}
      onMouseEnter={() => setHoveredQuizCard(true)}
      onMouseLeave={() => setHoveredQuizCard(false)}

    >
      {quizcard && hoveredQuizCard &&
        <div className='quizCardBtns'>
          {isCreator && deleteAllowed &&
            <>
              <button className='iconBtn'>
                <MdOutlineEdit />
              </button>
              <button className='iconBtn' onClick={() => deleteQuiz()}>
                <FaTrash />
              </button>
            </>
          }

          <button className='iconBtn'>
            <CiPlay1 />
          </button>
        </div>}

      <p>{quizcard ? quiz.name : text}</p>

      {inputBool &&
        <input
          className='inputPin'
          type='text'
          placeholder='Game PIN'
        // onChange={handleChange}
        // value={searchInput}
        />
      }
    </div>
  );
};

export default CardStartpage;
