import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Chat from "./Chat";
import Sidebar from "./SideBar";
import Bot from "./Bot";
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io("https://socketiogoncalo.webpubsub.azure.com", {
  path: "/clients/socketio/hubs/my_hub",
});

function App() {
  const [page, setPage] = useState('');
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [otherName, setOtherName] = useState("");
  const [messages, setMessages] = useState([]);
  const [calling, setCalling] = useState(false);
  const [callEnded] = useState(false);
  const [name, setName] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const myVideo = useRef(null);
  const userVideo = useRef();
  const connectionRef = useRef();

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
      console.log("me", id);
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
      <div className="top-bar">
        <h1>WebRTC APP</h1>
      </div>
      <div className="App">
        <Sidebar setPage={setPage} />
          {page === 'chat' && <Chat toggleCamera={toggleCamera} toggleMute={toggleMute} sendMessage={sendMessage} answerCall={answerCall} callUser={callUser} leaveCall={leaveCall} declineCall={declineCall} messages={messages} setMessages={setMessages} callEnded={callEnded} name={name} setName={setName} isCameraOff={isCameraOff} isMuted={isMuted} myVideo={myVideo} userVideo={userVideo} connectionRef={connectionRef} me={me} setMe={setMe} stream={stream} setStream={setStream} receivingCall={receivingCall} setReceivingCall={setReceivingCall} caller={caller} setCaller={setCaller} callerSignal={callerSignal} setCallerSignal={setCallerSignal} callAccepted={callAccepted} setCallAccepted={setCallAccepted} idToCall={idToCall} setIdToCall={setIdToCall} otherName={otherName} setOtherName={setOtherName} calling={calling} 
         setCalling={setCalling} />}
          {page === 'support' && <Bot />}
          {page === 'about' && <div>About Us Content</div>}
      </div>
    </>
  );
}

export default App;
