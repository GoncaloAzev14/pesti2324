// Sidebar.js
import React from "react";
import { useState } from "react";
import "./App.css";

function Sidebar({ setPage }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <button onClick={toggleSidebar} className="toggle-button">
        {isOpen ? "<" : ">"}
      </button>
      <ul>
        <li onClick={() => setPage("chat")}>Make a Call</li>
        <li onClick={() => setPage("about")}>About Us</li>
        <li onClick={() => setPage("support")}>Support</li>
      </ul>
    </div>
  );
}

export default Sidebar;
