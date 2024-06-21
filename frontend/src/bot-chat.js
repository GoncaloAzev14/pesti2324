/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
// eslint-disable-next-line no-lone-blocks
{
  callAccepted && !callEnded && (
    <div className="video-container">
      <div className="video2">
        <video
          playsInline
          ref={userVideo}
          autoPlay
          style={{ height: "95%", width: "auto", borderRadius: "8px" }}
        />
      </div>

      <div className="video1">
        {stream && (
          <video
            playsInline
            muted
            ref={myVideo}
            autoPlay
            style={{ width: "100px", height: "auto", borderRadius: "8px" }}
          />
        )}
        <div className="call-buttons">
          <Button
            variant="contained"
            color={isMuted ? "secondary" : "primary"}
            onClick={toggleMute}
            style={{ marginBottom: "5px" }}
          >
            {isMuted ? "Unmute" : "Mute"}
          </Button>
          <Button
            variant="contained"
            color={isCameraOff ? "secondary" : "primary"}
            onClick={toggleCamera}
            style={{ marginBottom: "5px" }}
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
      </div>

      <div className="chatzinho">
        <div className="chat-box">
          {messages.map((message, index) => {
            const isSentMessage = message.sender === me;

            const messageStyle = {
              backgroundColor: isSentMessage ? "#dcf8c6" : "#ebebeb",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "10px",
              alignSelf: isSentMessage ? "flex-end" : "flex-start",
              maxWidth: "100%",
              wordWrap: "break-word",
            };

            const senderName = isSentMessage ? "You" : otherName || "Friend";

            return (
              <div key={index} style={messageStyle}>
                <span>{senderName}: </span>
                {message.text}
              </div>
            );
          })}
        </div>

        <div className="message-input-container">
          <TextField
            id="message"
            label="Message"
            variant="filled"
            className="message-input"
            style={{
              flex: 1,
              marginRight: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "8px",
            }}
          />
          <Button variant="contained" onClick={sendMessage}>
            <NearMeIcon color="white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
