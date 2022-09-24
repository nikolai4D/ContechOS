import Navbar from "../components/Navbar.js";
import Dashboard from "../views/Dashboard.js";
import APIs from "../views/APIs.js";
import Datas from "../views/Datas.js";
import Configs from "../views/Configs.js";
import Props from "../views/Props.js";
import Login from "../views/Login.js";
import Register from "../views/Register.js";
import Filter from "../views/Filter.js";

export default async function router() {
  const routes = [
    { path: "/", view: Dashboard },
    { path: "/apis", view: APIs },
    { path: "/login", view: Login },
    { path: "/register", view: Register },
    { path: "/datas", view: Datas },
    { path: "/configs", view: Configs },
    { path: "/props", view: Props },
    { path: "/filter", view: Filter },
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

  if(view.setupToolBar !== undefined){
    document.querySelector("#toolBar").innerHTML = "";
    view.setupToolBar();
  }
  else{
    document.querySelector("#toolBar").innerHTML = "";
  }

  const viewResult = await view.getTemplate();
  //No nav
  if (match.route.path === "/login" || match.route.path === "/register") {
    document.querySelector("#app").innerHTML = viewResult;
  } else if (Array.isArray(viewResult)) {
    document.querySelector("#nav").innerHTML = await nav.getTemplate();
    for (const node of viewResult) {
      document.querySelector("#app").appendChild(node);
    }
  } else if (viewResult instanceof SVGElement) {
    document.querySelector("#nav").innerHTML = await nav.getTemplate();
    document.querySelector("#app").appendChild(viewResult);
  } else {
    document.querySelector("#nav").innerHTML = await nav.getTemplate();
    document.querySelector("#app").innerHTML = viewResult;
  }
}
