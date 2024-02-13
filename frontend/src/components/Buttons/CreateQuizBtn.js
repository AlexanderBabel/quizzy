import './LoginBtn.css';
import { useNavigate } from 'react-router-dom';

const CreateQuizBtn = () => {
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
    </div>
  );
};

export default CreateQuizBtn;
