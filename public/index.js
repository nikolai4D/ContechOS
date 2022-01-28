import Navbar from "./components/Navbar.js";
import Dashboard from "./views/Dashboard.js";
import Datas from "./views/Datas.js";
import Configs from "./views/Configs.js";
import Props from "./views/Props.js";
import Login from "./views/Login.js";

const router = async () => {
  const routes = [
    { path: "/", view: Dashboard },
    { path: "/login", view: Login },
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
  if (match.route.path === "/login") {
    window.localStorage.clear();
    console.log(`Cleared localStorage`);
    document.querySelector("#app").innerHTML = await view.getTemplate();
  } else if (match.route.path === "/") {
    window.localStorage.clear();
    console.log(`Cleared localStorage`);
    document.querySelector("#nav").innerHTML = await nav.getTemplate();
    document.querySelector("#app").innerHTML = await view.getTemplate();
  } else {
    window.localStorage.removeItem(match.route.path.slice(1));
    console.log(`Removed localStorage for ${match.route.path.slice(1)}`);
    document.querySelector("#nav").innerHTML = await nav.getTemplate();
    document.querySelector("#app").appendChild(await view.getTemplate());
  }
};

window.addEventListener("popstate", router);

//Main eventListener after DOMContentLoaded

document.addEventListener("DOMContentLoaded", () => {
  //Find current accessToken
  let startToken = sessionStorage.getItem("accessToken");

  if (!startToken) {
    console.log("No accessToken found");
    navigateTo("/login");

    //Setup for Login
    document.body.addEventListener("click", (e) => {
      if (e.target.getAttribute("data-link") === "/login") {
        e.preventDefault();
        const loginForm = document.getElementById("login-form");
        const email = loginForm.email.value;
        const pwd = loginForm.pwd.value;

        const auth = async () => {
          try {
            const responseAuth = await fetch("/api/auth", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ email, pwd }),
            });

            if (!responseAuth.ok) {
              if (responseAuth.status === 401) {
                return alert("Not ok");
              }
              throw new Error(
                `${responseAuth.status} ${responseAuth.statusText}`
              );
            }

            const token = `Bearer ${(await responseAuth.json()).accessToken}`;
            sessionStorage.setItem("accessToken", token);

            navigateTo("/");
            location.reload();
          } catch (err) {
            console.log(err);
          }
        };
        auth();
      }
    });
  } else {
    console.log("Found AccessToken");

    //Verify accessToken

    //let currenToken = sessionStorage.getItem("accessToken");

    const handleToken = async () => {
      try {
        const responseVerifyToken = await fetch("/api/verify", {
          method: "GET",
          headers: { authorization: sessionStorage.getItem("accessToken") },
        });

        //AccessToken is FALSE
        if (!(await responseVerifyToken.json())) {
          console.log("AccessToken is FALSE");

          //Clear sessionStorage (accessToken) and set jwt cookie (refreshToken) to expire in the past

          //   document.cookie = "jwt= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
          //   sessionStorage.clear();

          navigateTo("/login");
          location.reload();
        } else {
          console.log("AccessToken is TRUE");
          //AccessToken is TRUE, use RefreshToken to get new accessToken

          try {
            const responseRefreshToken = await fetch("/api/refresh", {
              method: "GET",
            });

            console.log("Set new accessToken");
            //Set new accessToken
            let tokenNew = `Bearer ${
              (await responseRefreshToken.json()).accessToken
            }`;

            sessionStorage.setItem("accessToken", tokenNew);
          } catch (err) {
            console.log("error");
          }
        }
      } catch (err) {
        console.log("error");
      }
    };
    handleToken();

    document.body.addEventListener("click", (e) => {
      if (e.target.matches("[data-link]")) {
        e.preventDefault();
        handleToken();
        navigateTo(e.target.getAttribute("data-link"));
      }

      if (e.target.getAttribute("data-link") === "/logout") {
        console.log("logout pressed");
        //e.preventDefault();
        sessionStorage.setItem("accessToken", "loggedOut");
        navigateTo("/login");
        location.reload();
      }
    });
    router();

    // }
  }
});

// Navigate back/forward with browser back/forward button
const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};
