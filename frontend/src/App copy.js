import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PhoneIcon from "@mui/icons-material/Phone";
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import "./App.css";

const socket = io("https://socketiogoncalo.webpubsub.azure.com", {
  path: "/clients/socketio/hubs/my_hub",
});

function App() {
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
  }, [messages, idToCall]);

  useEffect(() => {
    socket.on("callEnded", () => {
      setCalling(false);
      setIdToCall("");
      setCallAccepted(false);
      setReceivingCall(false);
      setOtherName("");
      setMessages([]);
    });
  }, []);

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
      userVideo.current.srcObject = stream;
    });

    socket.on("callAccepted", (data) => {
      setCalling(false);
      setCallAccepted(true);
      peer.signal(data.signal);
      setOtherName(data.name);
    });

    connectionRef.current = peer;
  };

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
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  //===========================================================================================

  const declineCall = () => {
    setReceivingCall(false); // Stop indicating that a call is being received
    socket.emit("callDeclined", { to: caller }); // Notify the caller that the call has been declined
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
    if (stream) {
      stream.getAudioTracks()[0].enabled = isMuted;
      setIsMuted(!isMuted);
    }
  };

  //===========================================================================================

  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = isCameraOff;
      setIsCameraOff(!isCameraOff);
    }
  };

  //===========================================================================================

  return (
    <div className="app-container">
      <h1 className="app-title">WebRTC App</h1>
      <div className="controls">
        {callAccepted && !callEnded && (
          <>
            <Button variant="contained" color="primary" onClick={toggleMute}>
              {isMuted ? "Unmute" : "Mute"}
            </Button>
            <Button variant="contained" color="primary" onClick={toggleCamera}>
              {isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
            </Button>
          </>
        )}
        <Button variant="contained" color="secondary" onClick={leaveCall}>
          End Call
        </Button>
      </div>
      <div className="video-container">
        <div className="video">
          {stream && (
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className="video-player"
            />
          )}
        </div>
        <div className="video">
          {callAccepted && !callEnded ? (
            <video
              playsInline
              ref={userVideo}
              autoPlay
              className="video-player"
            />
          ) : null}
        </div>
      </div>
      <div className="chat-container">
        <div className="chat-box">
          {messages.map((message, index) => {
            const isSentMessage = message.sender === me;
            const messageClass = isSentMessage
              ? "sent-message"
              : "received-message";
            const senderName = isSentMessage ? "You" : "Friend";

            return (
              <div key={index} className={messageClass}>
                <span>{senderName}: </span>
                {message.text}
              </div>
            );
          })}
        </div>
        <div className="message-input-container">
          <TextField id="message" variant="filled" className="message-input" />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            className="send-button"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
