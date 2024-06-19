import React, { useState } from "react";
import "./SideBar.css";
import {
  FaPhone,
  FaInfoCircle,
  FaQuestionCircle,
} from "react-icons/fa";

function Sidebar({ setPage }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={`sidebar ${isOpen ? "open" : "collapsed"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
