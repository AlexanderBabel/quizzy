import CardStartpage from '../Card/CardStartpage';
import './MyQuizzes.css';

const MyQuizzes = ({quizzes, setUpdate}) => {

 
  return (
    <div className='myQuizzesWrapper' >
    
    <div >
    <h3>My created quizzes</h3>
    <div className='quizzes'>
      
        {quizzes.length > 0 ?
        quizzes.map((quiz) => {
            return (
            <CardStartpage quizcard={true} quiz={quiz} setUpdate={setUpdate}/>
            )
            
        }) :
        <p>No created quizzes</p>
        }
    </div>
    </div>
    </div>
  );
};

export default MyQuizzes;
