import './LoginBtn.css';
import { useNavigate } from 'react-router-dom';

const CreateQuizBtn = ({ setToken }) => {
  const navigate = useNavigate();

  return (
    <div className='loginBtnWrapper'>
      <button
        type='button'
        className='loginBtn'
        onClick={() => navigate('/CreateQuiz')}
      >
        Create quiz
      </button>
      <button type="button" className="loginBtn"
        onClick={(e) => {
          e.preventDefault();
          setToken(null);
        }}>
        Log out
      </button>
    </div>
  );
};

export default CreateQuizBtn;
