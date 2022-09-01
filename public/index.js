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

//To get the properties related to a project via a profile or a phase, assuming we only now the title of the project

const firstQuery= JSON.stringify( {
    query: `query RooterQueryType($nodeInput:NodeInput){
    node(nodeInput:$nodeInput){
        id
        parentNode {
          relations {
            title,
            id
          }
        }
      }
    }`, variables: {
        nodeInput: {
          title: "Aulan1"
        }
      }
    })

// From the request above we infer the ids of the project and the parent relations profileToProject and phaseToProject
//  We use these data in the second request.

// Get all the phases and profiles related to node
const secondQuery = JSON.stringify({
  query: `query RooterQueryType($relationInput1:RelationInput, $relationInput2:RelationInput){
  projects: relation(relationInput:$relationInput1){
      sourceNode {
        relations {
          sourceNode {
            title
            id
            parentId
          }
        }
      }
    },
  phases: relation(relationInput:$relationInput2){
      sourceNode {
        relations {
          sourceNode {
            title
            id
            parentId
          }
        }
      }
    },
  }`, variables: {
    relationInput1: {
      parentId:"r_t_1",
      target:"n_i_1"
    },
    relationInput2: {
      parentId:"r_t_2",
      target:"n_i_1"
    }
  }
})

// Here the db is simple, we end up with all the sources of the relations of the related phases and profiles, we can then extract the properties from the json in the client.
// If there was really too much other kinds of relations linked to profiles and phases we could have narrowed the search by splitting the second query into two more targeted ones.

// What can be improved in the current implementation:
//    - Add additional filtering (is source/target/parentID to node?) -> require to look one level deeper, doable.
//    - Add mutations, I have done some, it works, I do not have it working with current db.
//    - Plug it to the real data.
//    - Allow for multiple values of a same property to be validated (id: [1,2,3,4]).
//
//    - In the node GraphType, divide the relations field in two: relNodeIsTargetTo and relNodeIsSourceTo.
//    - find a way to communicate args between resolvers.

Actions.GRAPHQL_QUERY(firstQuery).then(r => console.log("graphQL response:" + JSON.stringify(r, null, 2)))

window.addEventListener("popstate", router);