import CardStartpage from '../Card/CardStartpage';
import './MyQuizzes.css';

const MyQuizzes = ({quizzes}) => {

 
  return (
    <div className='myQuizzesWrapper' >
    
    <div >
    <h3>My created quizzes</h3>
    <div className='quizzes'>
        {quizzes.map((quiz) => {
            return (
            <CardStartpage quizcard={true} quizname={quiz.name}/>
            )
            
        })}


    </div>
    </div>
    </div>
  );
};

export default MyQuizzes;
