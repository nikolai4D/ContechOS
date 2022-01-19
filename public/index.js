import Navbar from "./components/Navbar.js"
import Dashboard from "./views/Dashboard.js"
import Datas from "./views/Datas.js"
import Configs from "./views/Configs.js"
import Props from "./views/Props.js"

// Navigate back/forward with browser back/forward button

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
}

const router = async () => {

    const routes = [
        { path: "/", view: Dashboard },
        { path: "/datas", view: Datas },
        { path: "/configs", view: Configs },
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
        window.localStorage.clear()
        console.log(`Cleared localStorage`)
        document.querySelector("#app").innerHTML = await view.getTemplate();
    } else {
        window.localStorage.removeItem(match.route.path.slice(1));
        console.log(`Removed localStorage for ${match.route.path.slice(1)}`)
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
