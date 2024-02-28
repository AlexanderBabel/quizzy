import React, { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({ setSearchTerm }) {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (event) => {
    if (event.key === "Enter" && searchInput !== "") {
      setSearchTerm(searchInput);
      setSearchInput("");
    }
  };

  const handleChange = (event) => {
    const query = event.target.value;
    setSearchInput(query);
  };

  return (
    <div className="searchbarWrapper">
      <input
        className="searchInput"
        type="text"
        placeholder="Search quiz..."
        onChange={handleChange}
        value={searchInput}
        onKeyUp={handleSearch}
      />
    </div>
  );
}
