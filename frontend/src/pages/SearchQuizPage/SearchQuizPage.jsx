import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SearchQuizPage.css";
import background from "../../images/blob-scene-haikei.svg";
import Searchbar from "../../components/Searchbar/Searchbar";
import CardStartPage from "../../components/Card/CardStartPage";
import LoginBtn from "../../components/Buttons/LoginBtn";
import useToken from "../../context/useToken";

export default function SearchQuizPage() {
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
    <div className="startPage" style={svgStyle}>
      <div className="startPageTop">
        <Searchbar setSearchTerm={setSearchTerm} />
        <LoginBtn token={token} isGuest={isGuest} setToken={setToken} />
      </div>

      <div className="searchQuizzes">
        {res &&
          res.length > 0 &&
          res.map((quiz) => {
            return <CardStartPage quiz={quiz} quizcard={true} />;
          })}
      </div>
    </div>
  );
}
