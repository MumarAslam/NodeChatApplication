import LoginPage from "../pages/Login/index.js";
import Signup from "../pages/Signup/index.js";
import Home from "../pages/Home/index.js";
import AddPost from "../pages/AddPost/index.js";
import DashBord from "../pages/DashBord/index.js";
import Message from "../pages/Message/index.js";

const Routes = [
  {
    path: "/",
    name: "login",
    exact: true,
    component: LoginPage,
  },
  {
    path: "/message/:id",
    name: "Message",
    exact: true,
    component: Message,
  },
  {
    path: "/room",
    name: "room",
    exact: true,
    component: DashBord,
  },
  {
    path: "/add",
    name: "AddPost",
    exact: true,
    component: AddPost,
  },
  {
    path: "/home",
    name: "Home",
    exact: true,
    component: Home,
  },
  {
    path: "/signup",
    name: "signup",
    exact: true,
    component: Signup,
  },
];

export default Routes;
