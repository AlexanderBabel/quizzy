import background from "../../images/blob-scene-haikei.svg";
import Searchbar from "../../components/Searchbar/Searchbar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CardStartpage from "../../components/Card/CardStartpage";
import "./SearchQuiz.css";
import LoginBtn from "../../components/Buttons/LoginBtn";
import useToken from "../../components/useToken/useToken";

function SearchQuiz() {
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;
  const { token, isGuest, setToken } = useToken();

  const [searchTerm, setSearchTerm] = useState("");
  const [res, setRes] = useState();

  const searchQuiz = () => {
    axios
      .get(`${apiEndpoint}/v1/quiz/search`, {
        params: {
          query: searchTerm,
        },
      })
      .then(function (response) {
        setRes(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (searchTerm !== "") {
      searchQuiz();
    }
    // eslint-disable-next-line
  }, [searchTerm]);

  const svgStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    width: "100vw",
    height: "100vh",
    margin: 0,
    padding: 0,
    overflow: "hidden",
  };

  return (
    <div className="startpage" style={svgStyle}>
      <div className="startpageTop">
        <Searchbar setSearchTerm={setSearchTerm} />
        <LoginBtn token={token} isGuest={isGuest} setToken={setToken} />
      </div>

      <div className="searchQuizzes">
        {res &&
          res.length > 0 &&
          res.map((quiz) => {
            return <CardStartpage quiz={quiz} quizcard={true} />;
          })}
      </div>
    </div>
  );
}

export default SearchQuiz;
