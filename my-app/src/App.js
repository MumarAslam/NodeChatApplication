import React from "react";
import logo from "./logo.svg";
import "./App.css";
import * as createHistory from "history";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Routes from "./routes";

const history = createHistory.createBrowserHistory();

function App() {
  return (
    <div className="App">
      <BrowserRouter history={history}>
        <Switch>
          {Routes.map(({ component: Cmp, ...route }, i) => (
            <Route key={i} {...route} render={(props) => <Cmp {...props} />} />
          ))}
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
