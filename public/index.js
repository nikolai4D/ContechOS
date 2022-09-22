import router from "./helpers/router.js";
import navigateTo from "./helpers/navigateTo.js";
import handleToken from "./helpers/handleToken.js";
import auth from "./helpers/auth.js";
import register from "./helpers/register.js";
import Actions from "./store/Actions.js";
import functionRouter from "./helpers/functionRouter.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMContentLoaded");

  document.body.addEventListener("click", async (e) => {
    if (e.target.getAttribute("data-link") === "/logout") {
      e.preventDefault();
      sessionStorage.clear();
      fetch("/api/logout");
      navigateTo("/login");
      //location.reload();
      console.log("Logout");
    }

    if (e.target.getAttribute("data-function") === "/login") {
      console.log("Login Function");
      e.preventDefault();
      const loginForm = document.getElementById("login-form");
      const email = loginForm.email.value;
      const pwd = loginForm.pwd.value;
      auth(email, pwd);
    }

    if (e.target.getAttribute("data-function") === "/register") {
      console.log("Register Function");
      e.preventDefault();
      const registerForm = document.getElementById("register-form");
      const email = registerForm.email.value;
      const pwd = registerForm.pwd.value;
      const code = registerForm.code.value;
      register(email, pwd, code);
    }


    else if (e.target.matches("[data-function]")) {
      // e.preventDefault();
      await functionRouter(e.target.getAttribute("data-function"), e)
    }


    if (e.target.getAttribute("data-view") == "/register") {
      console.log("Register View");
      e.preventDefault();
      navigateTo(e.target.getAttribute("data-view"));
    }

    if (
      e.target.matches("[data-link]") &&
      e.target.getAttribute("data-link") !== "/login" &&
      e.target.getAttribute("data-link") !== "/register"
    ) {
      console.log("View click event target");
      e.preventDefault();
      let handledToken = await handleToken(
        sessionStorage.getItem("accessToken")
      );
      if ((await handledToken) !== false) {
        navigateTo(e.target.getAttribute("data-link"));
      }
    }
  });

  window.addEventListener("load", async (e) => {
    console.log("Window load event target");
    if (window.location.pathname !== "/login") {
      console.log("Window load event target not login");
      e.preventDefault();
      let handledToken = await handleToken(
        sessionStorage.getItem("accessToken")
      );
      if ((await handledToken) !== false) {
        navigateTo(window.location.pathname);
      } else {
        sessionStorage.clear();
        fetch("/api/logout");
        navigateTo("/login");
        //location.reload();
        console.log("Logout");
      }
    }
  });

  if (!sessionStorage.getItem("accessToken")) {
    console.log("No AccessToken");
    sessionStorage.clear();
    fetch("/api/logout");
    navigateTo("/login");
  } else {
    handleToken(sessionStorage.getItem("accessToken"));
  }
});


const firstQuery = JSON.stringify({
  query: `query RooterQueryType($input:QueryInput){
    properties(itemInput:$input){
        id
        title
        defType
      }
    }`, variables: {
    input: {
    }
  }
})

//
// const fetchQuery= JSON.stringify( {
//   query: `query RooterQueryType($itemInput:QueryInput){
//     items(itemInput:$itemInput){
//         configObj {
//           id
//           title
//           defType
//         }
//         typeData {
//           id
//           title
//           defType
//         }
//       }
//     }`, variables: {
//     itemInput: {
//       title: "Intec1"
//     }
//   }
// })

// const createQuery= JSON.stringify( {
//   query: `mutation whatever($item:CreateInput){
//     create(item:$item){
//         id
//         title
//         }
//     }`, variables: {
//     item: {
//       kindOfItem: "node",
//       title: "BillyBop",
//     }
//   }
// })



async function d() {
  const data = await Actions.GRAPHQL(firstQuery)
  console.log("data: " + JSON.stringify(data, null, 2))
}
d()

window.addEventListener("popstate", router);