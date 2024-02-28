import { useNavigate } from 'react-router-dom';
import './Startpage.css'
import background from '../../images/blob-scene-haikei.svg'
import CardStartpage from '../../components/Card/CardStartpage';
import LoginBtn from '../../components/Buttons/LoginBtn';
import MyQuizzes from '../../components/MyQuizzes/MyQuizzes';
import useToken from '../../components/useToken/useToken';

function Startpage() {
  const { isCreator } = useToken();
  const navigate = useNavigate();

  const svgStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    width: '100vw',
    height: '100vh',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
  };

  return (
    <div className='startpage' style={svgStyle}>
      <div className='startpageTop'>
        <LoginBtn />
      </div>
      <div className='cardContainer'>
        {process.env.NODE_ENV === 'development' &&
          <CardStartpage text={'Socket Tester'} onclick={() => navigate('/SocketTester')} />
        }
        <CardStartpage text={'Join a quiz!'} inputBool={true} />
        {isCreator && <CardStartpage onclick={() => navigate('/CreateQuiz')} text={'Create quiz'} />}
        <CardStartpage text={'Discover quizzes'} onclick={() => navigate('/SearchQuiz')} />
      </div>
      {isCreator &&
        <div className='myQuizzes'>
          <MyQuizzes />
        </div>}
    </div>
  );
}

export default Startpage;
