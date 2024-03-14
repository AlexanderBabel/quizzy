import React, { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({ submit }) {
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className="searchbarWrapper">
      <input
        className="searchInput"
        type="text"
        placeholder="Search quiz..."
        value={searchInput}
        onChange={(event) => {
          setSearchInput(event.target.value);
        }}
        onKeyUp={(event) => {
          if (event.key === "Enter") {
            submit(searchInput);
          }
        }}
      />
    </div>
  );
}
