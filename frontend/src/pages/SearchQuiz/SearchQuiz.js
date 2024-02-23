import background from '../../images/blob-scene-haikei.svg'
import Searchbar from '../../components/Searchbar/Searchbar';
import {  useLocation} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CardStartpage from '../../components/Card/CardStartpage';
import './SearchQuiz.css'
import LoginBtn from '../../components/Buttons/LoginBtn';


function SearchQuiz(props) {

    const { token, setToken } = props;
    const [searchTerm, setSearchTerm] = useState('')
    const [res, setRes] = useState()
    console.log(res)




  const searchQuiz = (event) => {
   
   console.log('submit')
      axios.get('http://localhost:3001/v1/quiz/search', {
        params: {
          query: searchTerm
        }})
      .then(function (response) {
        console.log(response)
        setRes(response.data)
      })
      .catch(function (error) {
        console.log(error);
      })
    
  }

useEffect(() => {
    if (searchTerm  !== ''){
        searchQuiz()
    }
  },[searchTerm]);


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



  return (
    <div className='startpage' style={svgStyle}>
      <div className='startpageTop'>
        <Searchbar setSearchTerm={setSearchTerm}/>
        <LoginBtn token={token} setToken={setToken} />
      </div>
     
      <div className='searcQuizzes'>

      {res && res.length > 0 &&
        res.map((quiz) => {
            console.log(quiz)
            return (
            <CardStartpage quiz={quiz} quizcard={true}/>
            )
            
        })
        }

      </div>
    </div>
  );
}

export default SearchQuiz;
