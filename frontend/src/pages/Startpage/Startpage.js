import background from '../../images/blob-scene-haikei.svg'
import Searchbar from '../../components/Searchbar/Searchbar';
import CardStartpage from '../../components/Card/CardStartpage';
import './Startpage.css'
import LoginBtn from '../../components/Buttons/LoginBtn';
import CreateQuizBtn from '../../components/Buttons/CreateQuizBtn';
import MyQuizzes from '../../components/MyQuizzes/MyQuizzes';

function Startpage() {
  const isLoggedIn= true
  
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

  const quizzes = [
    {name: 'Test quiz 1'},
    {name: 'Test quiz 2'},
    {name: 'Test quiz 3'},
    {name: 'Test quiz 4'},
    {name: 'Test quiz 5'},
    {name: 'Test quiz 6'},
    {name: 'Test quiz 7'},
  ]


  return (
        <div className='startpage' style={svgStyle}>       
          <div className='startpageTop'>
          <Searchbar/>
          {isLoggedIn ? <CreateQuizBtn/> : <LoginBtn/>}
          </div>
          <div className='cardContainer'>
          <CardStartpage text={'Join a quiz!'} inputBool={true}/>
          <CardStartpage text={'Discover quizzes'}/>
          </div>
          <div className='myQuizzes'>
            <MyQuizzes quizzes={quizzes}/>
          </div>
        </div>
  );
}

export default Startpage;
