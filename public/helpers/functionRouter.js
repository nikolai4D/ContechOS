import checkFilter, {checkAll} from "../components/filter/filterFunctions.js";
import copyToClipboard from "../components/modalHelpers.js";

export default async function (demandedRoute, event) {
    const routes = [

        { path: 'checkFilter', request: checkFilter },
        { path: 'checkAll', request: checkAll },
        { path: 'copyToClipboard', request: copyToClipboard }


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
