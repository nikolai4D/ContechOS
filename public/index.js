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

const req1 = JSON.stringify({
  query: `query RootQueryType($pseudo: String){
    hello(pseudo:$pseudo)
  }`, variables: {
    pseudo:'pablo'
  }
})

//req example to get api info.
const req2 = JSON.stringify({
  query: `query RootQueryType{
  __schema {
    queryType {
      name
    }
  }
}`
})

const profile4 = {
  name:"D",
  project:"project4"
}

//req example to create an object.
const req3 = JSON.stringify({
  query: `mutation RootMutationType($profile:ProfileInput){
  create(profile:$profile){
  name
  }
}`, variables: {
      profile:profile4
    }
})

//The server side graphql take care of filtering the fields we want in the response (here only the name).
const req5 = JSON.stringify({
  query: `query RootQueryType($projectName: String){
    projectProfiles(projectName:$projectName){
    name
    }
  }`, variables: {
    projectName:"project3"
  }
})

//The server side graphql take care of filtering the fields we want in the response (here only the name).
//The simplifiedDB have purposely some circular relations, it doesn't cause any problems as graphql doesn't fetch all the result and then filter.
//This request use GraphQLTypes serverside, allowing to dynamically fetch the next node, even if they belong to a flat array.
// Instead it just fetch the demanded fields.
const req6 = JSON.stringify({
  query: `query RootQueryType($id: String){
    node(id:$id){
      title,
      relations{
        id
        source {
          title
          }
        target {
          title
          }
        }
    }
  }`, variables: {
    id:"n_1"
  }
})

const req7 = JSON.stringify({
  query: `query RootQueryType($id: String){
    node(id:$id){
      title,
      relations{
        id
        source {
          title
          }
        target {
          title
          }
        }
    }
  }`, variables: {
    id:"n_1",
    condition:true
  }
})


// Chain queries
// From my current knowledge there is no way to feed the result of the first query to the second.
const req8 = JSON.stringify({
  query: `query RootQueryType($id: String){
    node1: node(id:$id){
      title
    },
    node2: node(id:$id){
      title
    }
  }`, variables: {
    id:"n_1"
  }
})

const req9 = JSON.stringify({
  query: `query RooterQueryType($id: String){
  contechNode(id:$id){
      title
      parentNode {
        id
      }
    }
  }`, variables: {
    id:"n_i_1"
  }
})

Actions.GRAPHQL_QUERY(req9).then(r => console.log("graphQL response:" + JSON.stringify(r, null, 2)))

window.addEventListener("popstate", router);