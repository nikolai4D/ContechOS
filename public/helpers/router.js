import Navbar from "../components/Navbar.js";
import Dashboard from "../views/Dashboard.js";
import Datas from "../views/Datas.js";
import Configs from "../views/Configs.js";
import Props from "../views/Props.js";
import Login from "../views/Login.js";
import Register from "../views/Register.js";

export default async function router() {
  const routes = [
    { path: "/", view: Dashboard },
    { path: "/login", view: Login },
    { path: "/register", view: Register },
    { path: "/datas", view: Datas },
    { path: "/configs", view: Configs },
    { path: "/props", view: Props },
  ];

  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      isMatch: location.pathname === route.path,
    };
  });

  let match = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);

  if (!match) {
    match = {
      route: routes[0],
      isMatch: true,
    };
  }

  const view = new match.route.view();
  const nav = new Navbar();
  document.querySelector("#nav").innerHTML = "";
  document.querySelector("#app").innerHTML = "";

  //No nav
  if (match.route.path === "/login" || match.route.path === "/register") {
    document.querySelector("#app").innerHTML = await view.getTemplate();
  } else if (match.route.path === "/") {
    document.querySelector("#nav").innerHTML = await nav.getTemplate();
    document.querySelector("#app").innerHTML = await view.getTemplate();
  } else {
    document.querySelector("#nav").innerHTML = await nav.getTemplate();
    document.querySelector("#app").appendChild(await view.getTemplate());
  }
}
