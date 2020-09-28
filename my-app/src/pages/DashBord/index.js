import React from "react";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";
import { apiUrl } from "../../constant/urls";
import { getLocalStoreag } from "../../constant/sessions";
const DashboardPage = (props) => {
  const [chatrooms, setChatrooms] = React.useState([]);
  const nameRef = React.createRef();

  const getChatrooms = () => {
    const url = apiUrl + "/chatroom";
    axios
      .get(url, {
        headers: {
          Authorization: "Bearer " + getLocalStoreag(),
        },
      })
      .then((response) => {
        setChatrooms(response.data);
      })
      .catch((err) => {
        setTimeout(getChatrooms, 3000);
      });

    //   try {
    //     const url = apiUrl + "/user/signup";
    //     const responce = await axios.post(url, {
    //       email: email,
    //       password: password,
    //       role: role,
    //       confirm_password: confirmPasswor,
    //       name: name,
    //     });
    //     if (responce) {
    //       this.props.history.push("/");
    //     }
    //   } catch (e) {}
    // };
  };

  React.useEffect(() => {
    getChatrooms();
    // eslint-disable-next-line
  }, []);

  const createChatRoom = async () => {
    const name = nameRef.current.value;
    try {
      const url = apiUrl + "/chatroom";
      const headers = { authorization: `Bearer ${getLocalStoreag()}` };
      const responce = await axios.post(url, { name }, { headers });
      if (responce) {
        getChatrooms();
      }
    } catch (e) {}
  };

  return (
    <div className="card">
      <div className="cardHeader">Chatrooms</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="chatroomName">Chatroom Name</label>
          <input
            type="text"
            name="chatroomName"
            id="chatroomName"
            placeholder="ChatterBox"
            ref={nameRef}
          />
        </div>
      </div>
      <button onClick={() => createChatRoom()}>Create Chatroom</button>
      <div className="chatrooms">
        {chatrooms.map((chatroom) => (
          <div key={chatroom._id} className="chatroom">
            <div>{chatroom.name}</div>
            <Link to={"/message/" + chatroom._id}>
              <div className="join">Join</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withRouter(DashboardPage);
