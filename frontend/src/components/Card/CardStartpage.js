import './CardStartpage.css';
import { useState } from 'react';
import { MdOutlineEdit } from "react-icons/md";
import { FaTrash } from 'react-icons/fa';
import { CiPlay1 } from "react-icons/ci";
import axios from 'axios';
import useToken from '../../components/useToken/useToken';


const CardStartpage = ({text, inputBool, quizcard, onclick, quiz, setUpdate}) => {
 const [hoveredQuizCard, setHoveredQuizCard] = useState(false)
 const { token, setToken } = useToken(); 

  
 function deleteQuiz() {
  
  let config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  console.log(typeof(quiz.quizId))
    axios.delete(`http://localhost:3001/v1/quiz/${Number(quiz.quizId)}/delete`, config)
    .then(function (response) {
      setUpdate(true)
    })
    .catch(function (error) {
      console.log(error);
    })
}
 
  return (
    <div className={quizcard ? 'cardStartpageWrapper' :'cardStartpageWrapper'} 
    onClick={onclick}
    onMouseEnter={() => setHoveredQuizCard(true)}
    onMouseLeave={() => setHoveredQuizCard(false)}

    >
      {quizcard && hoveredQuizCard &&
        <div className='quizCardBtns'>
       
        <button className='iconBtn'>
          <MdOutlineEdit/>
        </button>
        <button className='iconBtn' onClick={deleteQuiz}>
            <FaTrash/>
        </button>
        <button className='iconBtn'>
           <CiPlay1/>
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
