import React, { useState } from "react";
import "./SideBar.css";
import {
  FaPhone,
  FaInfoCircle,
  FaQuestionCircle,
  FaHome,
} from "react-icons/fa";

function Sidebar({ setPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const handleSelection = (page) => {
    setSelected(true);
    setPage(page);
  };

  const handleHomeClick = () => {
    setSelected(false);
    setPage(null);
  };

  return (
    <>
      {!selected && (
        <div className="centered-buttons">
          <button onClick={() => handleSelection("chat")}>
            <FaPhone className="icon" />
            <span>Make a Call</span>
          </button>
          <button onClick={() => handleSelection("about")}>
            <FaInfoCircle className="icon" />
            <span>About Us</span>
          </button>
          <button onClick={() => handleSelection("support")}>
            <FaQuestionCircle className="icon" />
            <span>Support</span>
          </button>
        </div>
      )}
      {selected && (
        <div
          className={`sidebar ${isOpen ? "open" : "collapsed"}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <ul>
            <li onClick={handleHomeClick}>
              <FaHome className="icon" />
              {isOpen && <span>Home</span>}
            </li>
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
      )}
    </>
  );
}

export default Sidebar;
