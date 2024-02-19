import background from '../../images/blob-scene-haikei.svg'
import Searchbar from '../../components/Searchbar/Searchbar';
import CardStartpage from '../../components/Card/CardStartpage';
import './Startpage.css'
import LoginBtn from '../../components/Buttons/LoginBtn';
import CreateQuizBtn from '../../components/Buttons/CreateQuizBtn';
import MyQuizzes from '../../components/MyQuizzes/MyQuizzes';
import { useState, useEffect } from 'react';
import axios from 'axios';


function Startpage(props) {
  const { token, setToken } = props;
  const [myCreatedQuizzes, setMyCreatedQuizzes] = useState([])
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

  useEffect(() => {
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
    // eslint-disable-next-line
  },[]);

  return (
    <div className='startpage' style={svgStyle}>
      <div className='startpageTop'>
        <Searchbar />
        {token ? <CreateQuizBtn setToken={setToken} /> : <LoginBtn setToken={setToken} />}
      </div>
      <div className='cardContainer'>
        <CardStartpage text={'Join a quiz!'} inputBool={true} />
        <CardStartpage text={'Discover quizzes'} />
      </div>
      {token && <div className='myQuizzes'>
        <MyQuizzes quizzes={myCreatedQuizzes} />
      </div>}
    </div>
  );
}

export default Startpage;
