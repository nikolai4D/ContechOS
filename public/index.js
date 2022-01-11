import Navbar from "./components/Navbar.js"
import Dashboard from "./views/Dashboard.js"
import Data from "./views/Data.js"
import Config from "./views/Config.js"
import Props from "./views/Props.js"

// Navigate back/forward with browser back/forward button

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
}

const router = async () => {

    const routes = [
        { path: "/", view: Dashboard },
        { path: "/data", view: Data },
        { path: "/config", view: Config },
        { path: "/props", view: Props }

    ];

    const potentialMatches = routes.map(route => {
        return {
            route: route,
            isMatch: location.pathname === route.path
        }
    })

    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

    if (!match) {
        match = {
            route: routes[0],
            isMatch: true
        }
    }

    const nav = new Navbar;
    const view = new match.route.view;

    document.querySelector("#navbar").innerHTML = await nav.getTemplate();
    document.querySelector("#app").innerHTML = "";

    if (match.route.path === "/") {
        document.querySelector("#app").innerHTML = await view.getTemplate();
    } else {
        document.querySelector("#app").appendChild(await view.getTemplate());
    }
}

window.addEventListener("popstate", router)

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    })
    router();


})
