import React, { useState } from 'react';

import './Searchbar.css';

const Searchbar = () => {
  const [searchInput, setSearchInput] = useState('');

 


  const handleChange = (event) => {
    const query = event.target.value;
    setSearchInput(query);
    // const filtered = data.filter((item) =>
    //   item.name.toLowerCase().includes(query.toLowerCase())
    // );
    // setCurrentData(filtered);
  };

 

  return (
    <div className='searchbarWrapper'>
      <input
        className='searchInput'
        type='text'
        placeholder='Search quiz...'
        onChange={handleChange}
        value={searchInput}
      />

  
    </div>
  );
};

export default Searchbar;
