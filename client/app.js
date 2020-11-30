import * as Views from "./views/index.js";

let isAuth = () => {
  if (!localStorage.getItem("token")) {
    window.location.hash = "#/login";
  }
};

window.onhashchange = () => {
  let hashToken = window.location.hash.split("/");
  let route = hashToken[1];
  let id = hashToken[2];
  if (!route) route = "home";
  console.log("route:", route, "id:", id);

  switch (route) {
    case "home":
      // isAuth();
      Views.Home();
      break;
    case "login":
      Views.Login();
      break;
    case "signup":
      Views.Signup();
      break;
    case "logout":
      Views.Logout();
      break;
    default:
      Views.Home();
      break;
  }
};

window.addEventListener("load", (e) => {
  console.log("Window Onload!");
  isAuth();
  window.onhashchange();
});
