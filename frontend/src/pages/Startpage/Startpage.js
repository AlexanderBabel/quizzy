import background from '../../images/blob-scene-haikei.svg'
import CardStartpage from '../../components/Card/CardStartpage';
import './Startpage.css'
import LoginBtn from '../../components/Buttons/LoginBtn';
import MyQuizzes from '../../components/MyQuizzes/MyQuizzes';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Startpage(props) {
  const navigate = useNavigate();

  const { token, setToken } = props;
  const [myCreatedQuizzes, setMyCreatedQuizzes] = useState([])
  const [update, setUpdate] = useState(false)

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

  function getMyQuizzes() {
    if(token){
      let config = {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
       axios.get('http://localhost:3001/v1/quiz/list', config).then((response) => {
      setMyCreatedQuizzes(response.data);
    });
    }
  }

  useEffect(() => {
    getMyQuizzes()
    // eslint-disable-next-line
  },[]);

  useEffect(() => {
    if(update){
      getMyQuizzes()
    }
    setUpdate(false)
    // eslint-disable-next-line
  },[update]);

  return (
    <div className='startpage' style={svgStyle}>
      <div className='startpageTop'>
        <LoginBtn token={token} setToken={setToken} />
      </div>
      <div className='cardContainer'>
        <CardStartpage text={'Join a quiz!'} inputBool={true} />
       { token && <CardStartpage onclick={() => navigate('/CreateQuiz')} text={'Create quiz'} /> 
       }
       <CardStartpage text={'Discover quizzes'} onclick={() => navigate('/SearchQuiz')}/>
        

      </div>
      {token && 
      <div className='myQuizzes'>
        <MyQuizzes quizzes={myCreatedQuizzes} setUpdate={setUpdate} />
      </div>}
    </div>
  );
}

export default Startpage;
