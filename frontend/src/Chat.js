import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PhoneIcon from "@mui/icons-material/Phone";
import PhoneOff from "@mui/icons-material/CallEnd";
import NearMeIcon from "@mui/icons-material/Send";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import "./Chat.css";

const socket = io("https://socketiogoncalo.webpubsub.azure.com", {
  path: "/clients/socketio/hubs/my_hub",
});

function Chat() {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded] = useState(false);
  const [name, setName] = useState("");
  const [otherName, setOtherName] = useState("");
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [calling, setCalling] = useState(false);

  const myVideo = useRef(null);
  const userVideo = useRef();
  const connectionRef = useRef();

  //===========================================================================================

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      });

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
      setOtherName(data.name);
    });

    // atualização das mensagens recebidas e enviadas
    // referência ao backend socket.on("message", ...)
    socket.on("message", (data) => {
      setMessages([...messages, { text: data.text, sender: "other" }]);
    });

    socket.on("callDeclined", () => {
      setCalling(false);
      setReceivingCall(false);
      alert("The call was declined.");
    });

    socket.on("callEnded", () => {
      setCalling(false);
      setIdToCall("");
      setCallAccepted(false);
      setReceivingCall(false);
      setOtherName("");
      setMessages([]);
    });

    return () => {
      socket.off("me");
      socket.off("callUser");
      socket.off("message");
      socket.off("callDeclined");
      socket.off("callEnded");
    };
  }, [messages]);

  //===========================================================================================

  const callUser = (id) => {
    setCalling(true);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    socket.on("callAccepted", (data) => {
      setCalling(false);
      setCallAccepted(true);
      peer.signal(data.signal);
      setOtherName(data.name);
    });

    connectionRef.current = peer;
  };

  //===========================================================================================

  const answerCall = () => {
    setCallAccepted(true);
    setCalling(false);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller, name: name });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  //===========================================================================================

  const declineCall = () => {
    setReceivingCall(false);
    socket.emit("callDeclined", { to: caller });
  };

  //===========================================================================================

  const leaveCall = () => {
    socket.emit("endCall");
    setIdToCall("");
    setCallAccepted(false);
    setReceivingCall(false);
    setCalling(false);
    setOtherName("");
    setMessages([]);
  };

  //===========================================================================================

  // método de envio de mensagens
  // idToCall no caso de a mensagem ser enviada pelo user que fez a chamada
  // caller no caso de a mensagem ser enviada pelo user que recebeu a chamada
  // linha 211 para baixo fazem o tratamento das mensagens em html
  const sendMessage = () => {
    const messageInput = document.getElementById("message");
    const message = messageInput.value;

    if (message.trim() !== "") {
      const recipientId = callAccepted ? caller : idToCall;

      if (recipientId) {
        socket.emit("message", { to: recipientId, from: me, text: message });
      } else {
        socket.emit("message", { to: idToCall, from: me, text: message });
      }

      setMessages([...messages, { text: message, sender: me }]);
      messageInput.value = "";
    } else {
      console.log("Error Sending Messages");
    }
  };

  //===========================================================================================

  const toggleMute = () => {
    const audioTrack = stream
      .getAudioTracks()
      .find((track) => track.kind === "audio");
    if (audioTrack.enabled) {
      audioTrack.enabled = false;
      setIsMuted(true);
    } else {
      audioTrack.enabled = true;
      setIsMuted(false);
    }
  };

  //===========================================================================================

  const toggleCamera = () => {
    const videoTrack = stream
      .getTracks()
      .find((track) => track.kind === "video");
    if (videoTrack.enabled) {
      videoTrack.enabled = false;
      setIsCameraOff(true);
    } else {
      videoTrack.enabled = true;
      setIsCameraOff(false);
    }
  };

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
                      <div className="video">
                        <video
                          playsInline
                          ref={userVideo}
                          autoPlay
                          style={{ width: "300px" }}
                        />
                      </div>
                    ) : null}

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
}

export default Chat;
