import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './Searchbar.css';

const Searchbar = ({setSearchTerm}) => {
  const [searchInput, setSearchInput] = useState("");
 

  // const navigate = useNavigate();

  // const handleNavigate = (event) => {
  //   if (event.key === 'Enter' && searchInput !== "") {
  //      const searchTerm = searchInput;
  //      setSearchInput("")
  //   navigate(`/SearchQuiz?searchTerm=${searchTerm}`);
  //   }
   
  // };


  const handleSearch = (event) => {
    if (event.key === 'Enter' && searchInput !== "") {
      setSearchTerm(searchInput)
      setSearchInput('')
    }
  }


  const handleChange = (event) => {
    const query = event.target.value;
    setSearchInput(query);
  };

 

  return (
    <div className='searchbarWrapper'>
     

      <input
        className='searchInput'
        type='text'
        placeholder='Search quiz...'
        onChange={handleChange}
        value={searchInput}
        onKeyUp={handleSearch}
      />
  
    </div>
  );
};

export default Searchbar;
