import React from "react";
import { withRouter } from "react-router-dom";
import { getLocalStoreag } from "../../constant/sessions";
import makeToast from "../../Toaster";
import useSocket from "use-socket.io-client";
import { apiUrl } from "../../constant/urls";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { useImmer } from "use-immer";
import axios from "axios";

const ChatroomPage = (props) => {
  const chatroomId = props.match.params.id;
  const [messages, setMessages] = React.useState([]);
  const messageRef = React.useRef();
  const [userId, setUserId] = React.useState("");
  const [userTyping, setuserTyping] = React.useState(null);
  var timeout;

  const [socket] = useSocket(apiUrl, {
    query: {
      token: getLocalStoreag(),
    },
  });
  socket.connect();

  // const setupSocket = () => {
  //   const token = getLocalStoreag();
  //   if (token && !socket) {
  //     const newSocket = io(apiUrl, {
  //       query: {
  //         token: token,
  //       },
  //     });

  //     newSocket.on("disconnect", () => {
  //       setSocket(null);
  //       setTimeout(setupSocket, 3000);
  //       makeToast("error", "Socket Disconnected!");
  //     });

  //     newSocket.on("connect", () => {
  //       makeToast("success", "Socket Connected!");
  //     });

  //     setSocket(newSocket);
  //   }
  // };

  React.useEffect(async () => {
    try {
      const url = apiUrl + `/chatroom/messages/${props.match.params.id}`;
      const responce = await axios.post(url, {
        headers: {
          Authorization: "Bearer " + getLocalStoreag(),
        },
      });
      if (responce) {
        console.log("i am the response", responce);
      }
    } catch (e) {
      console.log(e);
    }
  });

  React.useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
        console.log(message);
        const newMessages = [...messages, ...message];
        setMessages(newMessages);
      });
    }
  }, [messages]);

  const sendMessage = () => {
    if (socket) {
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      });

      messageRef.current.value = "";
    }
  };

  React.useEffect(() => {
    console.log(socket);
    const token = getLocalStoreag();
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.user._id);
    }
    /////////////////////////////////////////////

    socket.on("connect", () => {
      makeToast("success", "Socket Connected!");
    });
    /////////////////////////////////////////////

    // socket.on("newMessage", (message) => {
    //   console.log(messages);
    //   const newMessages = [...messages, ...message];
    //   setMessages(newMessages);
    // });

    socket.on("disconnect", () => {
      makeToast("error", "Socket Disconnected!");
    });
    //////////////////////////////////////////////

    socket.emit("joinRoom", {
      chatroomId,
    });
    ////////////////////////////////////////////

    socket.on("isTyping", (info) => {
      console.log(info);
      setuserTyping(info);
    });

    return () => {
      //Component Unmount
      if (socket) {
        socket.emit("leaveRoom", {
          chatroomId,
        });
      }
    };
    //eslint-disable-next-line
  }, 0);

  const typeing = (e) => {
    socket.emit("typing", {
      chatroomId,
      typing: true,
    });

    timeout = clearTimeout(timeout);
    timeout = setTimeout(stoptypeing, 2000);
  };

  const stoptypeing = (e) => {
    socket.emit("typing", {
      chatroomId,
      typing: false,
    });
  };

  return (
    <div className="chatroomPage">
      <div className="chatroomSection">
        <div className="cardHeader">Chatroom Name</div>
        <div className="chatroomContent">
          {messages.map((message, i) => (
            <div
              key={i}
              className={userId === message.userId ? "message" : "otherMessage"}
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                lineBreak: "anywhere",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "10px",
                  lineBreak: "anywhere",
                }}
              >
                {message.message}
              </span>
              <span>{message.name}</span>
            </div>
          ))}
        </div>
        <div className="chatroomActions">
          {userTyping && userTyping.typing && userTyping.user != userId ? (
            <div>
              <Loader type="ThreeDots" color="#00BFFF" height={30} width={30} />
            </div>
          ) : (
            ""
          )}
          <div>
            <input
              type="text"
              name="message"
              id="one"
              placeholder="Say something!"
              onKeyPress={typeing}
              ref={messageRef}
            />
          </div>
          <div>
            <button className="join" onClick={sendMessage}>
              Send
            </button>
            <button
              style={{ marginTop: "5px" }}
              className="join"
              onClick={() => {
                props.history.push("/room");
              }}
            >
              Rooms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(ChatroomPage);
