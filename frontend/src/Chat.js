import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PhoneIcon from "@mui/icons-material/Phone";
import PhoneOff from "@mui/icons-material/CallEnd";
import NearMeIcon from "@mui/icons-material/Send";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
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

  return (
    <>
      <div className="page">
        <div className="container">
          <div className="video-container">
            <div className="videos">
              <div className="myVideoContainer">
                <>
                  <div className="video-container">
                    {callAccepted && !callEnded ? (
                      <>
                        <div className="video">
                          <video
                            playsInline
                            ref={userVideo}
                            autoPlay
                            style={{ width: "300px" }}
                          />
                        </div>

                        <div className="video">
                          {stream && (
                            <video
                              playsInline
                              muted
                              ref={myVideo}
                              autoPlay
                              style={{ width: "300px" }}
                            />
                          )}
                        </div>
                      </>
                    ) : null}
                  </div>

                  {/*//----------------------------------------------------------------------*/}

                  {callAccepted && !callEnded && (
                    <div className="buttonContainer-small">
                      <Button
                        variant="contained"
                        color={isMuted ? "secondary" : "primary"}
                        onClick={toggleMute}
                      >
                        {isMuted ? "Unmute" : "Mute"}
                      </Button>
                      <Button
                        variant="contained"
                        color={isCameraOff ? "secondary" : "primary"}
                        onClick={toggleCamera}
                      >
                        {isCameraOff ? "Camera On" : "Camera Off"}
                      </Button>
                      <div className="button">
                        <IconButton
                          aria-label="decline call"
                          style={{ color: "#c55d5d" }}
                          onClick={leaveCall}
                        >
                          <PhoneOff fontSize="large" />
                        </IconButton>
                      </div>
                    </div>
                  )}
                </>
              </div>
            </div>
          </div>

          {/*//----------------------------------------------------------------------*/}

          {!callAccepted && !receivingCall && (
            <div className="myId">
              <>
                <TextField
                  id="filled-basic"
                  label="Name"
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
                          <AssignmentIcon fontSize="large" color="primary" />
                        </IconButton>
                      </CopyToClipboard>
                      <div>
                        <IconButton
                          aria-label="call"
                          onClick={() => callUser(idToCall)}
                        >
                          <PhoneIcon fontSize="large" color="primary" />
                        </IconButton>
                      </div>
                    </>
                  )}
                </div>
              </>
            </div>
          )}

          {/*//----------------------------------------------------------------------*/}

          {/*//----------------------------------------------------------------------*/}

          <div className="message-container">
            {callAccepted && !callEnded ? (
              <>
                {/*//----------------------------------------------------------------------*/}

                <div className="chatzinho">
                  <div className="chat-box">
                    {messages.map((message, index) => {
                      // true se a mensagem foi enviada pelo user que fez a chamada
                      const isSentMessage = message.sender === me;

                      // se a mensagem foi enviada pelo user que fez a chamada, id = sent-message  -> apenas para css
                      const messageStyle = {
                        backgroundColor: isSentMessage ? "#dcf8c6" : "#ebebeb",
                        padding: "10px",
                        borderRadius: "8px",
                        marginBottom: "10px",
                        alignSelf: isSentMessage ? "flex-end" : "flex-start",
                        maxWidth: "100%",
                        wordWrap: "break-word",
                      };

                      const senderName = isSentMessage
                        ? name || "You"
                        : otherName || "Friend";

                      return (
                        <div key={index} style={messageStyle}>
                          <span>{senderName}: </span>
                          {message.text}
                        </div>
                      );
                    })}
                  </div>

                  {/*//----------------------------------------------------------------------*/}

                  <div className="message-input-container">
                    <TextField
                      id="message"
                      label="Message"
                      variant="filled"
                      className="message-input"
                      style={{ width: "300px" }}
                    />
                    <Button variant="contained" onClick={sendMessage}>
                      <NearMeIcon color="white" />
                    </Button>
                  </div>

                  {/*//----------------------------------------------------------------------*/}
                </div>
              </>
            ) : (
              <div>
                {receivingCall && !callAccepted ? (
                  <>
                    <span
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
                        color="primary"
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
                  </>
                ) : null}
              </div>
            )}
          </div>

          {/*//----------------------------------------------------------------------*/}
        </div>
      </div>
    </>
  );
};

export default Chat;
