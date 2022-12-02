import checkFilter, {checkAll, switchIntersection} from "../components/filter/filterFunctions.js";
import {eyeFunc,chevronFunc} from "../components/filter/toggleHideShow.js";
import {copyToClipboard, showApi, getQuery } from "../components/modalHelpers.js";

export default async function (demandedRoute, event) {
    const routes = [

        { path: 'checkFilter', request: checkFilter },
        { path: 'checkAll', request: checkAll },
        { path: 'toggleEyeHide', request: eyeFunc },
        { path: 'toggleChevron', request: chevronFunc },
        { path: 'copyToClipboard', request: copyToClipboard },
        { path: 'showApi', request: showApi },
        { path: 'getQuery', request: getQuery },
        { path: 'switchIntersection', request: switchIntersection}


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
