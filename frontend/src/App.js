import React, { useState } from "react";
import "./App.css";
import Chat from "./Chat";
import Sidebar from "./SideBar";
import Bot from "./Bot";

function App() {
  const [page, setPage] = useState('');

  return (
    <>
      <div className="top-bar">
        <h1>WebRTC APP</h1>
      </div>
      <div className="App">
        <Sidebar setPage={setPage} />
        <div className="content">
          {page === 'chat' && <Chat />}
          {page === 'support' && <Bot />}
          {page === 'about' && <div>About Us Content</div>}
        </div>
      </div>
    </>
  );
}

export default App;
