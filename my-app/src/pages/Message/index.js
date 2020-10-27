import React, { useRef, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { getLocalStoreag } from "../../constant/sessions";
import makeToast from "../../Toaster";
import useSocket from "use-socket.io-client";
import { apiUrl,chatUrl } from "../../constant/urls";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { useImmer } from "use-immer";
import axios from "axios";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";

const ChatroomPage = (props) => {
  const chatroomId = props.match.params.id;
  const [messages, setMessages] = React.useState([]);
  const messageRef = React.useRef();
  const [userId, setUserId] = React.useState("");
  const [userTyping, setuserTyping] = React.useState(null);
  var timeout;
  const el = useRef(null);
  const myRef = useRef(null);

  useEffect(() => {
    console.log("i am ref", myRef);
  }, [myRef.onscroll]);

  const [socket] = useSocket(chatUrl, {
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

  // React.useEffect(() => {
  //   (async function () {
  //     try {
  //       const url =
  //         apiUrl +
  //         `/chatroom/messages/${props.match.params.id}?page=1&limit=10`;
  //       const responce = await axios.get(url, {
  //         headers: {
  //           Authorization:  getLocalStoreag(),
  //         },
  //       });
  //       if (responce) {
  //         const newMessages = [...messages, ...responce.data];
  //         setMessages(newMessages);
  //       }
  //     } catch (error) {}
  //   })();
  //   return () => {};
  // }, []);

  React.useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
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

  useEffect(() => {
    if (el && el.current) el.current.scrollIntoView({ block: "end" });
    console.log(el);
  });

  React.useEffect(() => {
    const token = getLocalStoreag();
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
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
    console.log(chatroomId)
    ////////////////////////////////////////////

    socket.on("isTyping", (info) => {
      console.log(info,'i am typing');
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

  const papulate = (container) => {
    if (container === 0) {
      console.log("i am in");
    }
  };

  return (
    <div className="chatroomPage">
      <div className="chatroomSection">
        <div className="cardHeader">Chatroom Name</div>
        <div ref={myRef} className="chatroomContent">
          <PerfectScrollbar
            onScrollY={(container) => papulate(container.scrollTop)}
          >
            {messages.map((message, i) => (
              <div
                key={i}
                id={"el"}
                ref={el}
                className={
                  userId === message.userId ? "message" : "otherMessage"
                }
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
          </PerfectScrollbar>
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
