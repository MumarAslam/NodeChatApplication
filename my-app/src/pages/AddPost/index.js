import React, { Component } from "react";
import axios from "axios";
import { apiUrl } from "../../constant/urls";
import { getLocalStoreag } from "../../constant/sessions";
class LoginPage extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      error: "",
      selectedFile: null,
    };

    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.dismissError = this.dismissError.bind(this);
  }

  dismissError() {
    this.setState({ error: "" });
  }

  handleSubmit = async (evt) => {
    evt.preventDefault();
    console.log(this.state.file, "i am state");
    if (!this.state.username) {
      return this.setState({ error: "Username is required" });
    }

    if (!this.state.password) {
      return this.setState({ error: "Password is required" });
    }

    const data = new FormData();

    data.append("name", this.state.username);
    data.append("description", this.state.password);
    data.append("price", this.state.price);
    data.append("avatar", this.state.selectedFile);


    const headers = { authorization: `Bearer ${getLocalStoreag()}` };
    const url = apiUrl + "/post";
    const responce = await axios.post(url, data, { headers });
    return this.setState({ error: "" });
  };

  handleUserChange(evt) {
    this.setState({
      username: evt.target.value,
    });
  }

  handlePassChange(evt) {
    this.setState({
      password: evt.target.value,
    });
  }

  handlepriceChange = (evt) => {
    this.setState({
      price: evt.target.value,
    });
  };

  onChangeHandler = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    });
  };

  render() {
    return (
      <div style={{ marginTop: "300px" }}>
        <form onSubmit={this.handleSubmit}>
          {this.state.error && (
            <h3 data-test="error" onClick={this.dismissError}>
              <button onClick={this.dismissError}>✖</button>
              {this.state.error}
            </h3>
          )}
          <label>Name</label>
          <input
            type="text"
            data-test="username"
            value={this.state.username}
            onChange={this.handleUserChange}
          />
          <br />
          <label>price</label>
          <input value={this.state.price} onChange={this.handlepriceChange} />
          <br />
          <label>file</label>
          <input
            type="file"
            name="file"
            key="avatar"
            onChange={this.onChangeHandler}
          />
          <br />
          <label>description</label>
          <input value={this.state.password} onChange={this.handlePassChange} />
          <br />
          <input type="submit" value="Submit" data-test="submit" />
        </form>
      </div>
    );
  }
}

export default LoginPage;
