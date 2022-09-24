import checkFilter from "../components/filter/filterFunctions.js";

export default async function (demandedRoute, event) {
    const routes = [

        { path: 'checkFilter', request: checkFilter }

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
