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


const firstQuery= JSON.stringify( {
  query: `query RooterQueryType($projInp:NodeInput){
    node(nodeInput:$projInp){
        id
        title
        definitionType
        parentNode {
          title
        }
        relations {
          title
        }
        relations {
          sourceId
          targetId
        }
        childrenNodes {
          title
        }
      }
          sourceId
          targetId
        }
        childrenNodes {
          title
        }
      }
    }`, variables: {
    projInp: {
      title: "Intec1"
    }
  }
})

const createQuery= JSON.stringify( {
  query: `mutation whatever($relation:CreateRelationInput){
    createRelation(relation:$relation){
        id
        title
        definitionType
        }
    }`, variables: {
    relation: {
      title: "BillyBop",
      parentId: "cder_03d2e7e7-172c-461c-b29d-0859a514cdad-cd_befb06f8-2011-4d33-bdf9-1294d7b29395-cd_dabaf3ed-389a-433f-93d1-3b71d9133d23",
      targetId: "co_a3604711-737c-4d31-91f4-065f49d1b59d",
      sourceId: "co_302ec051-8167-4d40-826c-fd855e507869"
    }
  }
})

async function d() {
  const data = await Actions.GRAPHQL(createQuery)
  console.log("data: " + JSON.stringify(data, null, 2))
}
d()

window.addEventListener("popstate", router);