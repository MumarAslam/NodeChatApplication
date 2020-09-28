import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../constant/urls";
import { getLocalStoreag } from "../../constant/sessions";
const LoginPage = () => {
  const [data, setData] = useState("");

  useEffect(async () => {
    const headers = { authorization: `Bearer ${getLocalStoreag()}` };
    const url = apiUrl + "/post";
    const responce = await axios.get(url, { headers });
    if (responce) {
      setData(responce);
    }
  }, []);

  return (
    <div style={{ marginTop: "100px" }}>
      <div>
        <h1>Home</h1>
        {data &&
          data.data.map((item, i) => {
            return (
              <div style={{ marginTop: "20px" }}>
                <div>name : {item.name}</div>
                <div>description :{item.description}</div>
                <div>price : {item.price}</div>
                <div>file :{item.file}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default LoginPage;
