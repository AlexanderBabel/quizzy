import useAxios from 'axios-hooks';
import CardStartpage from '../Card/CardStartpage';
import './MyQuizzes.css';

export default function MyQuizzes() {
  const [{ data, loading }, refetch] = useAxios('quiz/list');

  if (!data && loading) {
    return <p>Loading...</p>
  }

  console.log(data);

  return (
    <div className='myQuizzesWrapper'>
      <div>
        <h3>My created quizzes</h3>
        <div className='quizzes'>
          {data && data.length > 0 ?
            data.map((quiz) => {
              return (
                <CardStartpage quizcard={true} quiz={quiz} setUpdate={() => refetch()} deleteAllowed={true} />
              )

            }) :
            <p>No created quizzes</p>
          }
        </div>
      </div>
    </div>
  );
};
