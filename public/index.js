import router from "./helpers/router.js";
import navigateTo from "./helpers/navigateTo.js";
import handleToken from "./helpers/handleToken.js";
import auth from "./helpers/auth.js";
import register from "./helpers/register.js";
import Actions from "./store/Actions.js";

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


// const firstQuery= JSON.stringify( {
//   query: `query RooterQueryType($projInp:NodeInput){
//     node(nodeInput:$projInp){
//         id
//         title
//         definitionType
//         parentNode {
//           title
//         }
//         relations {
//           title
//         }
//         relations {
//           sourceId
//           targetId
//         }
//         childrenNodes {
//           title
//         }
//       }
//           sourceId
//           targetId
//         }
//         childrenNodes {
//           title
//         }
//       }
//     }`, variables: {
//     projInp: {
//       title: "Intec1"
//     }
//   }
// })
//
// const createQuery= JSON.stringify( {
//   query: `mutation whatever($relation:CreateRelationInput){
//     createRelation(relation:$relation){
//         id
//         title
//         definitionType
//         }
//     }`, variables: {
//     relation: {
//       title: "BillyBop",
//       parentId: "coer_35943ac8-73c7-42c6-aa0f-49a067654628-co_728bf5d2-82bd-41d8-91cc-4cc92806b43b-co_a3604711-737c-4d31-91f4-065f49d1b59d",
//       targetId: "td_d65b9e56-fa5e-4d36-833d-823d139537d0",
//       sourceId: "td_27a3fba9-9859-4c4d-9ba7-e0ab3cbbdd14"
//     }
//   }
// })
//
// async function d() {
//   const data = await Actions.GRAPHQL(createQuery)
//   console.log("data: " + JSON.stringify(data, null, 2))
// }
// d()

window.addEventListener("popstate", router);