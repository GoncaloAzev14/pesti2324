import React from "react";
import { useState } from "react";
import "./SideBar.css";
import {
  FaPhone,
  FaInfoCircle,
  FaQuestionCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

function Sidebar({ setPage }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <button onClick={toggleSidebar} className="toggle-button">
        <span className="toggle-icon">
          {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </span>
      </button>
      <ul>
        <li onClick={() => setPage("chat")}>
          <FaPhone className="icon" />
          {isOpen && <span>Make a Call</span>}
        </li>
        <li onClick={() => setPage("about")}>
          <FaInfoCircle className="icon" />
          {isOpen && <span>About Us</span>}
        </li>
        <li onClick={() => setPage("support")}>
          <FaQuestionCircle className="icon" />
          {isOpen && <span>Support</span>}
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
