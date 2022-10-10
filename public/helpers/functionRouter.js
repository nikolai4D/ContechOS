import checkFilter, {checkAll} from "../components/filter/filterFunctions.js";
import toggleHideShow from "../components/filter/toggleHideShow.js";

export default async function (demandedRoute, event) {
    const routes = [

        { path: 'checkFilter', request: checkFilter },
        { path: 'checkAll', request: checkAll },
        { path: 'toggleHideShow', request: toggleHideShow }


    ];

    const potentialMatches = routes.map((route) => {
        return {
            route: route,
            isMatch: demandedRoute === route.path,
        };
    });

    let match = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);

    if (!match) {
        return alert("Request unknown");
    }

    await match.route.request(event);
}
