import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PhoneIcon from "@mui/icons-material/Phone";
import PhoneOff from "@mui/icons-material/CallEnd";
import NearMeIcon from "@mui/icons-material/Send";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import RobotIcon from "@mui/icons-material/SmartToy";
import ChatIcon from "@mui/icons-material/Chat";
import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import incomingCallImage from "./silhouette.jpeg";
import Sms from "./Sms.js";
import Bud from "./Bot.js";
import "./Chat.css";

const Chat = ({
  myVideo,
  userVideo,
  me,
  stream,
  receivingCall,
  callAccepted,
  idToCall,
  setIdToCall,
  otherName,
  calling,
  callEnded,
  name,
  setName,
  messages,
  isMuted,
  isCameraOff,
  toggleMute,
  toggleCamera,
  callUser,
  answerCall,
  declineCall,
  leaveCall,
  sendMessage,
}) => {
  //===========================================================================================

  const [smsChat, setSmsChat] = useState(false);

  const handleChat = () => {
    if (smsChat) {
      setSmsChat(false);
    } else {
      setSmsChat(true);
    }
  };

  return (
    <>
      <div className="container">
        {callAccepted && !callEnded && (
          <div className="video-container">
            <div className="video2">
              <video playsInline ref={userVideo} autoPlay />
            </div>

            <div className="right-container">
              <div className="video1-container">
                {stream && (
                  <div className="video1">
                    <video playsInline muted ref={myVideo} autoPlay />
                  </div>
                )}
                <div className="call-buttons">
                  <IconButton
                    variant="contained"
                    onClick={toggleMute}
                    style={{ marginBottom: "5px" }}
                  >
                    {isMuted ? <MicIcon /> : <MicOffIcon />}
                  </IconButton>
                  <IconButton
                    variant="contained"
                    onClick={toggleCamera}
                    style={{ marginBottom: "5px" }}
                  >
                    {isCameraOff ? <VideocamIcon /> : <VideocamOffIcon />}
                  </IconButton>
                  <div className="button">
                    <IconButton
                      aria-label="decline call"
                      style={{ color: "#c55d5d" }}
                      onClick={leaveCall}
                    >
                      <PhoneOff />
                    </IconButton>
                  </div>
                </div>
              </div>

              <div className="chatzinho">
                <IconButton variant="contained" onClick={handleChat}>
                  {smsChat ? (
                    <RobotIcon fontSize="large" />
                  ) : (
                    <ChatIcon fontSize="large" />
                  )}
                </IconButton>

                {smsChat ? (
                  <Bud />
                ) : (
                  <>
                    <div className="bud">
                      <Sms
                        smsChat={true}
                        messages={messages}
                        me={me}
                        otherName={otherName}
                      />

                      <div className="message-input-container">
                        <TextField
                          id="message"
                          label="Message"
                          variant="filled"
                          className="message-input"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              sendMessage();
                            }
                          }}
                          style={{
                            marginRight: "4px",
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderRadius: "6px",
                          }}
                        />
                        <IconButton variant="contained" onClick={sendMessage}>
                          <NearMeIcon color="white" />
                        </IconButton>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/*---------------------------------------------------------------------------------------------------------------------------------------------------------*/}

        <div className="call-interface">
          {" "}
          {/* MENU INICIAL DE CHAMADA */}
          {!callAccepted && !receivingCall && (
            <div className="myId">
              {" "}
              {/* MENU CALLER */}
              <>
                <TextField
                  id="filled-basic"
                  label="Your Name"
                  variant="filled"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ marginBottom: "20px" }}
                />

                <TextField
                  id="filled-basic"
                  label="ID to call"
                  variant="filled"
                  value={idToCall}
                  onChange={(e) => setIdToCall(e.target.value)}
                />

                {/*//----------------------------------------------------------------------*/}

                <div className="call-button">
                  {calling ? (
                    <>
                      <div className="cancel">
                        <IconButton
                          aria-label="decline call"
                          style={{ color: "#c55d5d" }}
                          onClick={leaveCall}
                        >
                          <PhoneOff fontSize="large" />
                        </IconButton>
                      </div>
                    </>
                  ) : (
                    <>
                      <CopyToClipboard text={me}>
                        <IconButton aria-label="copy">
                          <AssignmentIcon fontSize="large" color="#282c34" />
                        </IconButton>
                      </CopyToClipboard>
                      <div>
                        <IconButton
                          aria-label="call"
                          onClick={() => callUser(idToCall)}
                        >
                          <PhoneIcon fontSize="large" color="#282c34" />
                        </IconButton>
                      </div>
                    </>
                  )}
                </div>
              </>
            </div>
          )}
          {/*//----------------------------------------------------------------------*/}
          {receivingCall && !callAccepted && (
            <>
              <div className="incoming-call">
                {" "}
                {/* MENU CALL RECEIVER */}
                <TextField
                  id="filled-basic"
                  label="Your Name"
                  variant="filled"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ marginBottom: "20px" }}
                />
                <img
                  src={incomingCallImage}
                  alt="Incoming Call"
                  className="incoming-call-image"
                />
                <span
                  className="incoming-call-text"
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "grey",
                  }}
                >
                  Incoming Call From{" "}
                  {otherName ? '"' + otherName + '"' : "Your Friend!"}
                </span>
                <div className="caller">
                  <IconButton
                    aria-label="answer call"
                    color="#282c34"
                    onClick={answerCall}
                  >
                    <PhoneIcon fontSize="large" />
                  </IconButton>

                  <IconButton
                    aria-label="decline call"
                    style={{ color: "#c55d5d" }}
                    onClick={declineCall}
                  >
                    <PhoneDisabledIcon fontSize="large" />
                  </IconButton>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
