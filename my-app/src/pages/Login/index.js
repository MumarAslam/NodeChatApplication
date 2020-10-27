import React, { Component } from "react";
import axios from "axios";
import { apiUrl } from "../../constant/urls";
import { setLocalStoreage } from "../../constant/sessions";
// import makeToast from "../Toaster";
import { withRouter } from "react-router-dom";

const LoginPage = (props) => {
  const emailRef = React.createRef();
  const passwordRef = React.createRef();

  const loginUser = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const url = apiUrl + "/user-signin";
      const responce = await axios.post(url, {
        email: email,
        password: password,
        type: "EMAIL",
        role: "USER",
      });
      if (responce) {
        setLocalStoreage(responce.data.data.accessToken);
        props.history.push("/room");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="card">
      <div className="cardHeader">Login</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="abc@example.com"
            ref={emailRef}
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Your Password"
            ref={passwordRef}
          />
        </div>
        <button onClick={loginUser}>Login</button>
        <button
          style={{ marginTop: "5px" }}
          onClick={() => props.history.push("/signup")}
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default withRouter(LoginPage);
