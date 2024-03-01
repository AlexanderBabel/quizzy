import useAxios from "axios-hooks";
import CardStartPage from "../Card/CardStartPage";
import "./MyQuizzes.css";
import { Skeleton } from "@mui/material";

export default function MyQuizzes() {
  const [{ data, loading }, refetch] = useAxios("quiz/list", {
    useCache: false,
  });

  return (
    <div className="myQuizzesWrapper">
      <div>
        <h3>My created quizzes</h3>
        <div className="quizzes">
          {loading &&
            [0, 0, 0, 0].map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width={230}
                height={130}
                className="cardStartPageWrapper"
              />
            ))}
          {!loading &&
            (data && data.length > 0 ? (
              data.map((quiz) => {
                return (
                  <CardStartPage
                    key={quiz?.quizId}
                    quizCard={true}
                    quiz={quiz}
                    setUpdate={() => refetch()}
                    deleteAllowed={true}
                  />
                );
              })
            ) : (
              <p>No created quizzes</p>
            ))}
        </div>
      </div>
    </div>
  );
}
