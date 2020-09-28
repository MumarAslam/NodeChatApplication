import React from "react";
import axios from "axios";
import { apiUrl } from "../../constant/urls";
import { withRouter } from "react-router-dom";

const RegisterPage = (props) => {
  const nameRef = React.createRef();
  const emailRef = React.createRef();
  const passwordRef = React.createRef();
  const confirmPasswordRef = React.createRef();
  const roleRef = React.createRef();

  const registerUser = async (props) => {

    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPasswor = confirmPasswordRef.current.value;
    const role = roleRef.current.value;

    
    try {
      const url = apiUrl + "/user/signup";
      const responce = await axios.post(url, {
        email: email,
        password: password,
        role: role,
        confirm_password: confirmPasswor,
        name: name,
      });
      if (responce) {
        this.props.history.push("/");
      }
    } catch (e) {}
  };

  return (
    <div className="card">
      <div className="cardHeader">Registration</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="John Doe"
            ref={nameRef}
          />
        </div>
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
      <div className="inputGroup">
        <label htmlFor="password">Confirm Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Your Password"
          ref={confirmPasswordRef}
        />
      </div>
      <div className="inputGroup">
        <label htmlFor="name">Role</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="John Doe"
          ref={roleRef}
        />
      </div>

      <button onClick={registerUser}>Register</button>
    </div>
  );
};

export default withRouter(RegisterPage);
