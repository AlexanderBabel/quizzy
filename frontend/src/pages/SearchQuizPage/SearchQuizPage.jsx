import React, { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import useAxios from "axios-hooks";
import "./SearchQuizPage.css";
import background from "../../images/blob-scene-haikei.svg";
import SearchBar from "../../components/SearchBar/SearchBar";
import CardStartPage from "../../components/Card/CardStartPage";
import LoginBtn from "../../components/Buttons/LoginBtn";
import { enqueueSnackbar } from "notistack";

export default function SearchQuizPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [{ data, error, loading }, fetchResults] = useAxios(
    { url: "quiz/search", method: "get" },
    { manual: true }
  );

  useEffect(() => {
    if (searchTerm !== "") {
      fetchResults({ params: { query: searchTerm } });
    }
    // eslint-disable-next-line
  }, [searchTerm]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(`Error fetching quizzes. Message: ${error.message}`, {
        variant: "error",
      });
    }
  }, [error]);

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
        <SearchBar setSearchTerm={(term) => setSearchTerm(term)} />
        <LoginBtn />
      </div>

      <div className="searchQuizzes">
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
          data?.length > 0 &&
          data.map((quiz) => {
            return <CardStartPage quiz={quiz} quizCard={true} />;
          })}
      </div>
    </div>
  );
}
